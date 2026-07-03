import type { AnimeBase } from "./anime";

export interface SearchAnime extends AnimeBase {
  score: number;

  type: string;
  quality: string;

  comments: number;
  views: number;
}