export type SearchAnimeItem = {
  title: string;
  url: string;
};

export async function searchAnime(
  query: string,
): Promise<SearchAnimeItem[]> {
  void query;
  return [];
}

