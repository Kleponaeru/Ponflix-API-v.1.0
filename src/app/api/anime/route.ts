import { getAnime } from "@/lib/kuramanime/anime";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";

  const anime = await getAnime(slug);

  return Response.json({
    slug,
    anime,
  });
}

