import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

import { ANIWATCH_BASE_URL } from "@/constants";

export function absoluteUrl(value: string) {
  return value ? new URL(value, ANIWATCH_BASE_URL).toString() : "";
}

export function pathFromUrl(url: string) {
  return url ? new URL(url).pathname : "";
}

export function slugFromPath(path: string) {
  return path.replace(/^\/|\/$/g, "").replace(/^anime\//, "");
}

export function animeSlugFromEpisodeUrl(url: string) {
  return slugFromPath(pathFromUrl(url)).replace(/-episode-\d+$/i, "");
}

export function parseFirstNumber(value: string) {
  const match = value.match(/\d+/);

  return match ? Number(match[0]) : 0;
}

export function imageSource(item: cheerio.Cheerio<AnyNode>) {
  return item.find("img").attr("data-src") ?? item.find("img").attr("src") ?? "";
}
