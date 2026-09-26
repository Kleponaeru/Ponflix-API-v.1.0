import * as cheerio from "cheerio";

import type { Episode } from "@/types/episode";

import { absoluteUrl, pathFromUrl, parseFirstNumber, slugFromPath } from "./utils";

export function parseEpisodes(html: string): Episode[] {
  const $ = cheerio.load(html);
  const episodes: Episode[] = [];

  $("a.ssl-item.ep-item").each((_, element) => {
    const item = $(element);
    const url = absoluteUrl(item.attr("href") ?? "");
    const path = pathFromUrl(url);
    const title = item.find(".ep-name").text().trim() || item.attr("title")?.trim() || "";

    if (!url || !title) return;

    episodes.push({
      title,
      slug: slugFromPath(path),
      path,
      url,
      number: Number(item.attr("data-number")) || parseFirstNumber(title) || null,
    });
  });

  return episodes;
}
