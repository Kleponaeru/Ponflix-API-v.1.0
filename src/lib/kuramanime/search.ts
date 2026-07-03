import { kuramanimeClient } from "./client";
import { parseSearch } from "./parser/search";

export async function searchAnime(query: string) {
  const html = await kuramanimeClient.get(
    `/anime?search=${encodeURIComponent(query)}&order_by=oldest`
  );

  return parseSearch(html);
}