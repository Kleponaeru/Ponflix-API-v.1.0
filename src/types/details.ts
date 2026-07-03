import type { AnimeBase } from "./anime";

export interface AnimeDetails extends AnimeBase {
  japaneseTitle: string | null;

  synopsis: string | null;

  score: number | null;

  status: string | null;

  aired: string | null;

  type: string | null;

  duration: string | null;

  totalEpisodes: number | null;

  genres: string[];

  views: number | null;

  updatedAt: string | null;
}