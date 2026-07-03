export interface LatestAnime {
  animeId: number;
  slug: string;
  title: string;

  path: string;
  url: string;
  thumbnail: string;

  currentEpisode: number;
  totalEpisodes: number | null;

  type: string;
  quality: string;

  hot: boolean;
}