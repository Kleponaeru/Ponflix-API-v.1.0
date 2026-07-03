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

export interface SearchAnimeItem {
  title: string;
  url: string;
}

export interface AnimeDetails {
  slug: string;
  title: string;
  url: string;
  episodes: number[];
}
