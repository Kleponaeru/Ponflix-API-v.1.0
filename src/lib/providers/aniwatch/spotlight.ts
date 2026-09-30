import { aniwatchClient } from "./client";
import { parseSpotlight } from "./parser/latest";

export async function getSpotlightAnime() {
  const html = await aniwatchClient.get("/");

  return parseSpotlight(html);
}
