import { aniwatchClient } from "./client";
import { parseLatestCompleted } from "./parser/latest-completed";

export async function getLatestAnime() {
  const html = await aniwatchClient.get("/latest-completed/");

  return parseLatestCompleted(html);
}
