import { aniwatchClient } from "./client";
import { parseLatest } from "./parser/latest";

export async function getLatestAnime() {
  const html = await aniwatchClient.get("/");

  return parseLatest(html);
}
