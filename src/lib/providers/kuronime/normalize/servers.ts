import type { EpisodeServer } from "@/types/episode";

type DecryptedSource = {
  embed?: Record<string, Record<string, string>>;
  download?: Record<string, Record<string, string>>;
  filelions?: string | null;
  blog?: string | null;
};

type MirrorData = any;

export function normalizeServers(
  data: DecryptedSource,
  api: { blog?: string | null; filelions?: string | null },
  mirror?: MirrorData | null
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
    const mirrorEmbed = mirror.embed || mirror.sources || mirror.streams;

    if (mirrorEmbed) {
      for (const quality in mirrorEmbed) {
        for (const provider in mirrorEmbed[quality]) {
          safePush(
            `MIRROR - ${quality.toUpperCase()} - ${provider}`,
            `${quality},${provider}`,
            quality.toUpperCase(),
            provider,
            mirrorEmbed[quality][provider]
          );
        }
      }
    }
  }

  // 🔥 PRIORITY 2: DECRYPTED EMBED
  if (data.embed) {
    for (const quality in data.embed) {
      for (const provider in data.embed[quality]) {
        safePush(
          `${quality.toUpperCase()} - ${provider}`,
          `${quality},${provider}`,
          quality.toUpperCase(),
          provider,
          data.embed[quality][provider]
        );
      }
    }
  }

  // 🔥 PRIORITY 3: DOWNLOAD
  if (data.download) {
    for (const quality in data.download) {
      for (const provider in data.download[quality]) {
        safePush(
          `DOWNLOAD - ${provider}`,
          `${quality},${provider}`,
          quality.toUpperCase(),
          provider,
          data.download[quality][provider]
        );
      }
    }
  }

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