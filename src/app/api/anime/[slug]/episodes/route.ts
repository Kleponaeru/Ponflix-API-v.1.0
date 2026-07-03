import { NextResponse } from "next/server";
import { getEpisodes } from "@/lib/providers/kuronime/episodes";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const data = await getEpisodes(slug);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch episodes",
      },
      { status: 500 }
    );
  }
}