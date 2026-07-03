import type { AnimeBase } from "./anime";

export interface Episode extends AnimeBase {
  number: number | null;
}

export interface EpisodeServer {
  name: string;
  quality: string;
  provider: string;
  value: string;
}

export interface EpisodePlayer {
  title: string;
  iframe: string | null;
  servers: EpisodeServer[];
}
