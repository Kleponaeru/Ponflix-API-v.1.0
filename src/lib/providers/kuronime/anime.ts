import { kuronimeClient } from "./client";

import { parseAnime } from "./parser/anime";

export async function getAnime(slug: string) {
  const html = await kuronimeClient.get(`/anime/${slug}`);

  return parseAnime(html);
}