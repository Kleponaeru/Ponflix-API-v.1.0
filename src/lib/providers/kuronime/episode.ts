import { kuronimeClient } from "./client";
import { fetchEpisodeSources } from "./api";
import { parseEpisode } from "./parser/episode";
import { normalizeServers } from "./normalize/servers";
import type { DecryptedSource } from "./normalize/servers";
import type { EpisodeServer } from "@/types/episode";
import type { SourcesResponse } from "./api";

type MirrorData = (DecryptedSource & {
  download?: Record<string, Record<string, string>> | null;
  embed?: Record<string, Record<string, string>> | null;
}) | null;

function buildPlayerUrl(payload?: string | null) {
  return payload ? `https://player.animeku.org/?data=${payload}` : null;
}

function buildBlogUrl(blog?: string | null) {
  return blog ? `https://blog.animeku.org/player2.php?id=${blog}` : null;
}

function buildPlaybackServers(
  response: SourcesResponse,
  xenHash?: string | null,
): EpisodeServer[] {
  const vipUrl = buildPlayerUrl(response.src);
  const vipSdUrl = buildPlayerUrl(response.src_sd ?? null);
  const blogUrl = buildBlogUrl(response.blog);

  const servers: EpisodeServer[] = [];

  if (xenHash === "awar" && blogUrl) {
    servers.push({
      name: "BLOG PLAYER",
      value: "blog,default",
      quality: "BLOG",
      provider: "blog",
      url: blogUrl,
    });
  }

  if (vipUrl) {
    servers.push({
      name: "VIP PLAYER",
      value: "vip,default",
      quality: "VIP",
      provider: "vip",
      url: vipUrl,
    });
  }

  if (vipSdUrl) {
    servers.push({
      name: "VIP PLAYER SD",
      value: "vip_sd,default",
      quality: "VIP SD",
      provider: "vip_sd",
      url: vipSdUrl,
    });
  }

  if (xenHash !== "awar" && blogUrl) {
    servers.push({
      name: "BLOG PLAYER",
      value: "blog,default",
      quality: "BLOG",
      provider: "blog",
      url: blogUrl,
    });
  }

  return servers;
}

function uniqueServers(servers: EpisodeServer[]) {
  const seen = new Set<string>();

  return servers.filter((server) => {
    if (!server.url || seen.has(server.url)) return false;

    seen.add(server.url);
    return true;
  });
}

export async function getEpisode(slug: string) {
  const html = await kuronimeClient.get(`/${slug}`);

  const episode = parseEpisode(html);
  if (!episode) return null;

  const apiResponse = await fetchEpisodeSources(
    episode.sourceId,
    episode.xenHash,
  );

  if (!apiResponse) {
    console.warn("Episode source data unavailable", {
      slug,
      sourceId: episode.sourceId,
      xenHash: episode.xenHash,
    });

    return {
      ...episode,
      iframe: episode.iframe,
      servers: [],
      download: null,
      filelions: null,
      blog: null,
      raw: null,
    };
  }

  const playbackServers = buildPlaybackServers(apiResponse, episode.xenHash);
  const iframe = playbackServers[0]?.url ?? episode.iframe;

  let mirrorData: MirrorData = null;
  try {
    if (apiResponse.mirror) {
      mirrorData = JSON.parse(
        Buffer.from(apiResponse.mirror, "base64").toString("utf8"),
      ) as MirrorData;
    }
  } catch {
    mirrorData = null;
  }

  const normalizedServers = normalizeServers(
    (mirrorData ?? {}) as DecryptedSource,
    {
      blog: apiResponse.blog ?? null,
      filelions: mirrorData?.filelions ?? null,
    },
    mirrorData,
  );

  const servers = uniqueServers([...playbackServers, ...normalizedServers]);

  return {
    ...episode,
    iframe,
    servers,
    download: mirrorData?.download ?? null,
    filelions: mirrorData?.filelions ?? null,
    blog: apiResponse.blog ?? null,
    raw: apiResponse,
  };
}
