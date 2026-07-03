import { kuronimeClient } from "./client";
import { parseLatest } from "./parser/latest";

export async function getLatestAnime() {
  const html = await kuronimeClient.get("/");

  return parseLatest(html);
}