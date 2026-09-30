import { aniwatchClient } from "./client";
import { parseTrending } from "./parser/trending";

export async function getTrendingAnime() {
  const html = await aniwatchClient.get("/");

  return parseTrending(html);
}
