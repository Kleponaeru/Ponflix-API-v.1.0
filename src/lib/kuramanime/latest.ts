import { BASE_URL } from "@/constants";
import { fetchHTML } from "../request";
import { parseLatest } from "./parser";

export async function getLatestAnime() {
  const html = await fetchHTML(BASE_URL);

  return parseLatest(html);
}