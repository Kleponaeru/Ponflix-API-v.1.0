export type AnimeDetails = {
  title: string;
  url: string;
  episodes: number[];
};

export async function getAnime(slug: string): Promise<AnimeDetails | null> {
  void slug;
  return null;
}

