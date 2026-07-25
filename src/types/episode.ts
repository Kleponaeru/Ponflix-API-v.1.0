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

export interface EpisodeDetails extends EpisodePlayer {
  download: Record<string, Record<string, string>> | null;
  filelions: string | null;
  blog: string | null;
  raw: unknown;
  sourceStatus: "ok" | "degraded" | "blocked";
  sourceError: string | null;
  playbackAvailable: boolean;
}
