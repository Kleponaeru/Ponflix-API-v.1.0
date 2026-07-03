import type { SearchAnimeItem } from "@/types/anime";
import type { ApiResponse } from "@/types/response";
import { searchAnime } from "@/lib/kuramanime/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";

  const results = await searchAnime(query);

  const payload: ApiResponse<SearchAnimeItem[]> & { query: string } = {
    success: true,
    data: results,
    query,
  };

  return Response.json(payload);
}
