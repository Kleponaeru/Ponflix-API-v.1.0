import type { AnimeBase } from "./anime";

export interface Episode extends AnimeBase {
  number: number | null;
}