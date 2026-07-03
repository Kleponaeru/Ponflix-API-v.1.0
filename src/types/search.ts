import type { AnimeBase } from "./anime";

export interface SearchAnime extends AnimeBase {
  score: number | null;

  type: string | null;
}