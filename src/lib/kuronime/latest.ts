import { kuramanimeClient } from "./client";
import { parseLatest } from "./parser/latest";

export async function getLatestAnime() {
  const html = await kuramanimeClient.get("/");
  console.log(html.substring(0, 500));

  return parseLatest(html);
}
