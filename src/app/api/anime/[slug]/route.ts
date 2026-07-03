import type { AnimeDetails } from "@/types/anime";
import type { ApiResponse } from "@/types/response";
import { getAnime } from "@/lib/kuramanime/anime";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const anime = await getAnime(slug);

  const payload: ApiResponse<AnimeDetails | null> & { slug: string } = {
    success: true,
    data: anime,
    slug,
  };

  return Response.json(payload);
}
