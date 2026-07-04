import { kuronimeClient } from "./client";
import { fetchEpisodeSources } from "./api";
import { parseEpisode } from "./parser/episode";
import { decryptSource } from "./decrypt/decryptSource";
import { normalizeServers } from "./normalize/servers";
import { decodeMirror } from "./decrypt/decodeMirror";

export async function getEpisode(slug: string) {
  const html = await kuronimeClient.get(`/${slug}`);

  const episode = parseEpisode(html);
  if (!episode) return null;

  const apiResponse = await fetchEpisodeSources(
    episode.sourceId,
    episode.xenHash
  );

  if (!apiResponse?.src) {
    return {
      ...episode,
      raw: apiResponse,
    };
  }

  const decryptedText = decryptSource(
    apiResponse.src,
    apiResponse.token,
    episode.xenHash
  );

  if (!decryptedText) {
    return {
      ...episode,
      raw: apiResponse,
    };
  }

  let decrypted: any;

  try {
    decrypted = JSON.parse(decryptedText);
  } catch {
    return {
      ...episode,
      raw: apiResponse,
      decryptedText,
    };
  }

  const mirrorData = apiResponse.mirror
    ? decodeMirror(apiResponse.mirror, apiResponse.token)
    : null;

  const servers = normalizeServers(
    decrypted,
    apiResponse,
    mirrorData
  );

  return {
    ...episode,
    servers,
    download: decrypted?.download ?? [],
    filelions: decrypted?.filelions ?? null,
    blog: apiResponse.blog ?? null,
    raw: apiResponse,
  };
}