import { aniwatchClient } from "./client";
import { parseAnime } from "./parser/anime";

export async function getAnime(slug: string) {
  const html = await aniwatchClient.get(`/anime/${slug}/`);

  return parseAnime(html);
}
