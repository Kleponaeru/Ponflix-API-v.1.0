import { tmdbRequest } from "./client";

type TmdbSearchResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export async function searchTmdbMovies(
  query: string,
  page: number,
  language?: string,
) {
  const params = new URLSearchParams({ query, page: String(page) });
  if (language) params.set("language", language);

  return tmdbRequest<TmdbSearchResponse<Record<string, unknown>>>(
    "/search/movie",
    params,
  );
}
