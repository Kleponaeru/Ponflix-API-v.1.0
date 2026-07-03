import type { SearchAnimeItem } from "@/types/anime";
import { parseSearch } from "./parser/search";

export async function searchAnime(
  query: string,
): Promise<SearchAnimeItem[]> {
  void query;
  return parseSearch("");
}
