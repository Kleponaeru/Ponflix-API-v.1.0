import { BASE_URL } from "@/constants";

export function parseAnimeUrl(url: string) {
  const match = url.match(
    /anime\/(\d+)\/([^/]+)(?:\/episode\/(\d+))?/i
  );

  return {
    animeId: match ? Number(match[1]) : 0,
    slug: match ? match[2] : "",
    episode: match?.[3] ? Number(match[3]) : 0,
    path: url ? new URL(url, BASE_URL).pathname : "",
  };
}