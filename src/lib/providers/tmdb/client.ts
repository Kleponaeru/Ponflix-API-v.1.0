import { TMDB_BASE_URL } from "@/constants";

function tmdbCredentials() {
  const accessToken = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();

  if (!accessToken && !apiKey) {
    throw new Error(
      "TMDB is not configured. Set TMDB_READ_ACCESS_TOKEN or TMDB_API_KEY.",
    );
  }

  return { accessToken, apiKey };
}

export async function tmdbFetch(path: string, params?: URLSearchParams) {
  const { accessToken, apiKey } = tmdbCredentials();
  const url = new URL(`${TMDB_BASE_URL}${path}`);

  if (params) {
    params.forEach((value, key) => url.searchParams.set(key, value));
  }

  if (!accessToken && apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  return fetch(url, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    cache: "no-store",
  });
}

export async function tmdbRequest<T>(path: string, params?: URLSearchParams) {
  const response = await tmdbFetch(path, params);

  const payload = (await response.json().catch(() => null)) as
    | ({ status_message?: string; message?: string } & Record<string, unknown>)
    | null;

  if (!response.ok) {
    const message =
      payload?.status_message ??
      payload?.message ??
      `TMDB request failed with status ${response.status}.`;
    throw new Error(message);
  }

  if (payload === null) {
    throw new Error("TMDB returned an invalid JSON response.");
  }

  return payload as unknown as T;
}

export function copyQueryParams(
  source: URLSearchParams,
  allowed: readonly string[],
) {
  const params = new URLSearchParams();

  for (const key of allowed) {
    const value = source.get(key);
    if (value !== null) params.set(key, value);
  }

  return params;
}
