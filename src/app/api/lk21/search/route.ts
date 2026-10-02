import { searchLk21 } from "@/lib/providers/lk21/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();
  const requestedPage = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  if (!query) {
    return Response.json(
      { success: false, error: "Query parameter 'q' is required." },
      { status: 400 },
    );
  }

  try {
    const result = await searchLk21(query, page);
    return Response.json({
      success: true,
      query,
      page,
      totalPages: result.totalPages,
      total: result.data.length,
      data: result.data,
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
