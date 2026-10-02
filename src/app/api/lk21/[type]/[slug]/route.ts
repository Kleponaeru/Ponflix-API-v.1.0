import type { Lk21MediaType } from "@/types/lk21";

import { getLk21Title } from "@/lib/providers/lk21/title";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ type: string; slug: string }> },
) {
  const { type, slug } = await params;
  if (type !== "movie" && type !== "series") {
    return Response.json(
      { success: false, error: "Type must be 'movie' or 'series'." },
      { status: 400 },
    );
  }

  try {
    const data = await getLk21Title(slug, type as Lk21MediaType);
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
