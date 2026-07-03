import { kuronimeClient } from "./client";
import { parseEpisodes } from "./parser/episodes";

export async function getEpisodes(slug: string) {
  const html = await kuronimeClient.get(`/anime/${slug}`);

  return parseEpisodes(html);
}