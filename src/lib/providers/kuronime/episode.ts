import { kuronimeClient } from "./client";
import { parseEpisode } from "./parser/episode";

export async function getEpisode(slug: string) {
  const html = await kuronimeClient.get(`/${slug}`);

  return parseEpisode(html);
}