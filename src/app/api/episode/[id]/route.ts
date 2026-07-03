import type { EpisodeDetails } from "@/types/episode";
import type { ApiResponse } from "@/types/response";
import { getEpisode } from "@/lib/kuramanime/episode";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const episode = await getEpisode(id);

  const payload: ApiResponse<EpisodeDetails | null> & { id: string } = {
    success: true,
    data: episode,
    id,
  };

  return Response.json(payload);
}
