import { kuramanimeClient } from "./client";
import { parseLatest } from "./parser/latest";

export async function getLatestAnime() {
  const html = await kuramanimeClient.get("/");

  return parseLatest(html);
}