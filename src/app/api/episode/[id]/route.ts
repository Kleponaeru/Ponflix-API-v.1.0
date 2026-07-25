import type { EpisodeDetails } from "@/types/episode";
import type { ApiErrorResponse, ApiResponse } from "@/types/response";
import { getEpisode } from "@/lib/providers/kuronime/episode";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const episode = await getEpisode(id);

    const payload: ApiResponse<EpisodeDetails | null> & { id: string } = {
      success: true,
      data: episode,
      id,
    };

    return Response.json(payload);
  } catch (error) {
    console.error("Episode route failed", { id, error });

    const payload: ApiErrorResponse = {
      success: false,
      error: "Failed to load episode data",
    };

    return Response.json(payload, { status: 502 });
  }
}
