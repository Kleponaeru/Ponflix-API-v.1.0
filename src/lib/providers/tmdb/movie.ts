import { copyQueryParams, tmdbRequest } from "./client";

const MOVIE_QUERY_PARAMS = [
  "append_to_response",
  "language",
  "include_image_language",
] as const;

export async function getTmdbMovie(id: string, query: URLSearchParams) {
  const params = copyQueryParams(query, MOVIE_QUERY_PARAMS);
  return tmdbRequest<Record<string, unknown>>(
    `/movie/${encodeURIComponent(id)}`,
    params,
  );
}
