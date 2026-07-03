export type EpisodeDetails = {
  title: string;
  url: string;
  streamUrl?: string;
};

export async function getEpisode(
  slug: string,
): Promise<EpisodeDetails | null> {
  void slug;
  return null;
}
