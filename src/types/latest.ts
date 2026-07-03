import type { AnimeBase } from "./anime";

export interface LatestAnime extends AnimeBase {
  currentEpisode: number;
  totalEpisodes: number | null;

  type: string | null;
  quality: string | null;

  hot: boolean;

  views: number | null;
  timeAgo: string | null;
}