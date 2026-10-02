import { tmdbFetch } from "@/lib/providers/tmdb/client";

const MOVIE_RESOURCES = new Set([
  "alternative_titles",
  "credits",
  "external_ids",
  "images",
  "keywords",
  "recommendations",
  "release_dates",
  "reviews",
  "similar",
  "translations",
  "videos",
]);

const PERSON_RESOURCES = new Set([
  "combined_credits",
  "external_ids",
  "images",
  "movie_credits",
]);

const SENSITIVE_QUERY_PARAMS = new Set([
  "api_key",
  "access_token",
  "guest_session_id",
  "session_id",
]);

function isAllowedCatalogPath(path: string[]) {
  if (path.join("/") === "configuration") return true;
  if (path.join("/") === "discover/movie") return true;
  if (path.join("/") === "genre/movie/list") return true;
  if (
    ["search/movie", "search/person", "search/multi"].includes(path.join("/"))
  ) {
    return true;
  }
  if (path.join("/") === "watch/providers/movie") return true;
  if (
    path.length === 2 &&
    path[0] === "movie" &&
    ["now_playing", "popular", "top_rated", "upcoming"].includes(path[1])
  ) {
    return true;
  }
  if (
    path.length === 3 &&
    path[0] === "trending" &&
    path[1] === "movie" &&
    (path[2] === "day" || path[2] === "week")
  ) {
    return true;
  }
  if (path.length === 2 && path[0] === "find" && /^tt\d+$/.test(path[1])) {
    return true;
  }
  if (path[0] === "collection" && /^\d+$/.test(path[1] ?? "")) {
    return path.length === 2 || (path.length === 3 && path[2] === "images");
  }
  if (path[0] === "movie" && /^\d+$/.test(path[1] ?? "")) {
    if (path.length === 2) return true;
    if (path.length === 3) return MOVIE_RESOURCES.has(path[2]);
    return path.length === 4 && path[2] === "watch" && path[3] === "providers";
  }
  if (path[0] === "person" && /^\d+$/.test(path[1] ?? "")) {
    if (path.length === 2) return true;
    return path.length === 3 && PERSON_RESOURCES.has(path[2]);
  }

  return false;
}

function forwardPublicQueryParams(source: URLSearchParams) {
  const params = new URLSearchParams();
  source.forEach((value, key) => {
    if (!SENSITIVE_QUERY_PARAMS.has(key.toLowerCase())) {
      params.append(key, value);
    }
  });
  return params;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (!isAllowedCatalogPath(path)) {
    return Response.json(
      { success: false, error: "This TMDB catalog endpoint is not available." },
      { status: 404 },
    );
  }

  try {
    const safePath = `/${path.map((segment) => encodeURIComponent(segment)).join("/")}`;
    const query = forwardPublicQueryParams(new URL(request.url).searchParams);
    const upstream = await tmdbFetch(safePath, query);

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") ?? "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
