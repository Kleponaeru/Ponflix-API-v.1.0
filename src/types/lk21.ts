export type Lk21MediaType = "movie" | "series";

export interface Lk21Title {
  id: string | null;
  type: Lk21MediaType;
  slug: string;
  title: string;
  path: string;
  url: string;
  thumbnail: string | null;
  year: number | null;
  rating: number | null;
  quality: string | null;
  runtime: string | null;
  genres: string[];
  episode: number | null;
  season: number | null;
  complete: boolean | null;
}

export interface Lk21SearchPayload {
  data: Lk21Title[];
  totalPages: number;
}

export interface Lk21PlayerServer {
  name: string;
  url: string;
  selected: boolean;
}

export interface Lk21TitleDetails extends Lk21Title {
  description: string | null;
  director: string[];
  cast: string[];
  country: string[];
  servers: Lk21PlayerServer[];
  embedUrl: string | null;
}
