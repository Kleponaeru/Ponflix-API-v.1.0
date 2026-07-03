import { searchAnime } from "@/lib/kuronime/search";
import type { SearchAnime } from "@/types/search";
import type { ApiResponse } from "@/types/response";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  if (!query) {
    return Response.json(
      {
        success: false,
        error: "Query parameter 'q' is required.",
      },
      { status: 400 }
    );
  }

  try {
    const results = await searchAnime(query);

    const payload: ApiResponse<SearchAnime[]> & {
      query: string;
      total: number;
    } = {
      success: true,
      query,
      total: results.length,
      data: results,
    };

    return Response.json(payload);
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}