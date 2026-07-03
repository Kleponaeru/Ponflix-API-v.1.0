import { kuronimeClient } from "./client";
import { parseSearch } from "./parser/search";

export async function searchAnime(query: string) {
  const html = await kuronimeClient.get(
    `/?s=${encodeURIComponent(query)}`
  );

  return parseSearch(html);
}