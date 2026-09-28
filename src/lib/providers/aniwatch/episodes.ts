import { aniwatchClient } from "./client";
import { fetchEpisodeList } from "./api";
import { parseAnimeId } from "./parser/anime";
import { parseEpisodes } from "./parser/episodes";

export async function getEpisodes(slug: string) {
  const animeHtml = await aniwatchClient.get(`/anime/${slug}/`);
  const animeId = parseAnimeId(animeHtml);

  if (!animeId) return [];

  const html = await fetchEpisodeList(animeId);

  return parseEpisodes(html);
}
