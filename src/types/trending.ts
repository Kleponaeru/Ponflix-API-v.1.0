import type { AnimeBase } from "./anime";

export interface TrendingAnime extends AnimeBase {
  rank: number | null;
}
