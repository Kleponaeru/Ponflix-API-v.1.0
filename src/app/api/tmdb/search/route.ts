import { searchTmdbMovies } from "@/lib/providers/tmdb/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim();
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page =
    Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const language = url.searchParams.get("language")?.trim() || undefined;

  if (!query) {
    return Response.json(
      { success: false, error: "Query parameter 'query' is required." },
      { status: 400 },
    );
  }

  try {
    const result = await searchTmdbMovies(query, page, language);
    return Response.json({
      success: true,
      query,
      page: result.page,
      totalPages: result.total_pages,
      total: result.total_results,
      data: result.results,
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
