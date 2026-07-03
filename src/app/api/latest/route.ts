import { getLatestAnime } from "@/lib/providers/kuronime/latest";

export async function GET() {
  try {
    const data = await getLatestAnime();

    return Response.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}