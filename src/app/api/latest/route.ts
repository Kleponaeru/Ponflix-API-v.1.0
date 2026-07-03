import { getLatestAnime } from "@/lib/kuramanime/latest";

export async function GET() {
  const anime = await getLatestAnime();

  return Response.json({
    success: true,
    total: anime.length,
    data: anime,
  });
}