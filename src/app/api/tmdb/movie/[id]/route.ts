import { getTmdbMovie } from "@/lib/providers/tmdb/movie";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json(
      { success: false, error: "Movie ID must be a TMDB numeric ID." },
      { status: 400 },
    );
  }

  try {
    const data = await getTmdbMovie(id, new URL(request.url).searchParams);
    return Response.json({ success: true, data });
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
