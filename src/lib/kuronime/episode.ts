import type { EpisodeDetails } from "@/types/episode";
import { parseEpisode } from "./parser/episode";

export async function getEpisode(
  slug: string,
): Promise<EpisodeDetails | null> {
  void slug;
  return parseEpisode("");
}
