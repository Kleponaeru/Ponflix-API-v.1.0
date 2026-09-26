import { aniwatchClient } from "./client";
import { fetchEpisodeList } from "./api";
import { parseEpisodes } from "./parser/episodes";
import { parseEpisodePage } from "./parser/episode";

export async function getEpisodes(slug: string) {
  const pageHtml = await aniwatchClient.get(`/${slug}-episode-1/`);
  const page = parseEpisodePage(pageHtml);

  if (!page?.animeId) return [];

  const html = await fetchEpisodeList(page.animeId);

  return parseEpisodes(html);
}
