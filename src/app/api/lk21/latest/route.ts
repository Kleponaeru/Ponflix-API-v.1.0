import { getLatestLk21Movies } from "@/lib/providers/lk21/feeds";

export async function GET() {
  try {
    const data = await getLatestLk21Movies();
    return Response.json({ success: true, total: data.length, data });
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
