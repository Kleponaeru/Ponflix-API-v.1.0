import type { EpisodeServer } from "@/types/episode";

export type DecryptedSource = {
  embed?: ServerGroupMap | null;
  download?: ServerGroupMap | null;
  filelions?: string | null;
  blog?: string | null;
  sources?: ServerGroupMap | null;
  streams?: ServerGroupMap | null;
};

type ServerGroupMap = Record<
  string,
  Record<string, string | null | undefined> | string | null | undefined
>;

type MirrorData = Partial<DecryptedSource> | null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pushNestedServers(
  servers: EpisodeServer[],
  data: unknown,
  prefix: string,
) {
  if (!isRecord(data)) return;

  for (const [quality, providers] of Object.entries(data)) {
    const qualityLabel = quality.toUpperCase();

    if (isRecord(providers)) {
      for (const [provider, url] of Object.entries(providers)) {
        if (typeof url !== "string" || !url) continue;

        servers.push({
          name: `${prefix} - ${qualityLabel} - ${provider}`,
          value: `${quality},${provider}`,
          quality: qualityLabel,
          provider,
          url,
        });
      }

      continue;
    }

    if (typeof providers === "string" && providers) {
      servers.push({
        name: `${prefix} - ${qualityLabel}`,
        value: `${quality},default`,
        quality: qualityLabel,
        provider: "default",
        url: providers,
      });
    }
  }
}

export function normalizeServers(
  data: DecryptedSource,
  api: { blog?: string | null; filelions?: string | null },
  mirror?: MirrorData
): EpisodeServer[] {
  const servers: EpisodeServer[] = [];

  const safePush = (
    name: string,
    value: string,
    quality: string,
    provider: string,
    url: string | null
  ) => {
    if (!url) return;

    servers.push({
      name,
      value,
      quality,
      provider,
      url,
    });
  };

  // 🔥 PRIORITY 1: MIRROR DATA (if exists)
  if (mirror) {
    const mirrorEmbed = mirror.embed ?? mirror.sources ?? mirror.streams;
    pushNestedServers(servers, mirrorEmbed, "MIRROR");
  }

  // 🔥 PRIORITY 2: DECRYPTED EMBED
  pushNestedServers(servers, data.embed, "EMBED");

  // 🔥 PRIORITY 3: DOWNLOAD
  pushNestedServers(servers, data.download, "DOWNLOAD");

  // 🔥 PRIORITY 4: FILELIONS
  const filelionsUrl = data.filelions ?? api.filelions ?? null;

  safePush(
    "FILELIONS",
    "filelions,default",
    "FILELIONS",
    "filelions",
    filelionsUrl
  );

  // 🔥 PRIORITY 5: BLOG
  const blogUrl = data.blog ?? api.blog ?? null;

  safePush(
    "BLOG",
    "blog,default",
    "BLOG",
    "blog",
    blogUrl
  );

  return servers;
}
