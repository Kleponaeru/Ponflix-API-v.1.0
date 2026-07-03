import type { AnimeBase } from "./anime";

export interface LatestAnime extends AnimeBase {
  currentEpisode: number;
  totalEpisodes: number | null;

  type: string;
  quality: string;

  hot: boolean;
}