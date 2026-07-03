import type { AnimeDetails } from "@/types/anime";
import { parseAnime } from "./parser/anime";

export async function getAnime(slug: string): Promise<AnimeDetails | null> {
  void slug;
  return parseAnime("");
}
