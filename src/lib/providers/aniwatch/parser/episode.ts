import * as cheerio from "cheerio";

import type { EpisodeDetails, EpisodeServer } from "@/types/episode";

export interface EpisodePageInfo {
  animeId: string;
  episodeId: string;
  episodeNumber: string;
  title: string | null;
  iframe: string | null;
}

export function parseEpisodePage(html: string): EpisodePageInfo | null {
  const $ = cheerio.load(html);
  const detail = $("#ani_detail").first();

  if (detail.length === 0) return null;

  const episodeNumber =
    detail.attr("data-episode-number") ??
    html.match(/episode_number["']?\s*[:=]\s*["']?(\d+)/i)?.[1] ??
    "";
  const titleElement = detail.find(".anis-watch-detail .film-name").first();
  const title =
    titleElement.attr("data-en")?.trim() || titleElement.text().trim() || null;

  return {
    animeId: detail.attr("data-anime-id") ?? "",
    episodeId: detail.attr("data-id") ?? "",
    episodeNumber,
    title,
    iframe: detail.find(".watch-player iframe").attr("src") ?? null,
  };
}

function decodeServerUrl(hash: string) {
  try {
    return Buffer.from(hash, "base64").toString("utf8") || null;
  } catch {
    return null;
  }
}

function providerName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function parseEpisodeServers(html: string) {
  const $ = cheerio.load(html);
  const servers: EpisodeServer[] = [];

  $(".server-item").each((_, element) => {
    const item = $(element);
    const name = item.attr("data-server-name")?.trim() || item.text().trim();
    const type = item.attr("data-type")?.trim() || "sub";
    const url = decodeServerUrl(item.attr("data-hash") ?? "");

    if (!name || !url) return;

    servers.push({
      name,
      value: `${type},${providerName(name)}`,
      quality: name,
      provider: providerName(name),
      url,
    });
  });

  return servers.filter(
    (server, index, all) =>
      all.findIndex((candidate) => candidate.url === server.url) === index,
  );
}

export function parseEpisode(
  html: string,
  serverHtml = html,
): EpisodeDetails | null {
  const page = parseEpisodePage(html);

  if (!page) return null;

  const uniqueServers = parseEpisodeServers(serverHtml);
  const title = page.title
    ? `${page.title}${page.episodeNumber ? ` Episode ${page.episodeNumber}` : ""}`
    : null;
  const playbackAvailable = Boolean(page.iframe || uniqueServers.length > 0);

  return {
    title,
    iframe: page.iframe ?? uniqueServers[0]?.url ?? null,
    sourceId: page.episodeId,
    xenHash: null,
    servers: uniqueServers,
    download: null,
    filelions: null,
    blog: null,
    raw: {
      animeId: page.animeId || null,
      episodeNumber: page.episodeNumber || null,
      serverCount: uniqueServers.length,
    },
    sourceStatus: playbackAvailable ? "ok" : "degraded",
    sourceError: playbackAvailable ? null : "No playable servers were found",
    playbackAvailable,
  };
}
