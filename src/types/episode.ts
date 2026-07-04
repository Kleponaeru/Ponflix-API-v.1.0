import type { AnimeBase } from "./anime";

export interface Episode extends AnimeBase {
  number: number | null;
}

export interface EpisodeServer {
  name: string;
  value: string;
  quality: string;
  provider: string;
  url: string | null;
}

export interface EpisodePlayer {
  title: string | null;
  iframe: string | null;

  sourceId: string;
  xenHash: string | null;
  servers: EpisodeServer[];
}
