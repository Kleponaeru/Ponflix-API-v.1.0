import { searchAnime } from "@/lib/kuramanime/search";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";

  const results = await searchAnime(query);

  return Response.json({
    query,
    items: results,
  });
}

