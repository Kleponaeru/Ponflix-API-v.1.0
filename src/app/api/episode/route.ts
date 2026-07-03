import { getEpisode } from "@/lib/kuramanime/episode";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? "";

  const episode = await getEpisode(slug);

  return Response.json({
    slug,
    episode,
  });
}

