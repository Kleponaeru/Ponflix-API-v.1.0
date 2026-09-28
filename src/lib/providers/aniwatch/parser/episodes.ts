import * as cheerio from "cheerio";

import type { Episode } from "@/types/episode";

import { absoluteUrl, pathFromUrl, parseFirstNumber, slugFromPath } from "./utils";

export function parseEpisodes(html: string): Episode[] {
  const $ = cheerio.load(html);
  const episodes: Episode[] = [];
  const seenNumbers = new Set<number>();

  $("a.ssl-item.ep-item").each((_, element) => {
    const item = $(element);
    const url = absoluteUrl(item.attr("href") ?? "");
    const path = pathFromUrl(url);
    const title = item.find(".ep-name").text().trim() || item.attr("title")?.trim() || "";
    const number = Number(item.attr("data-number")) || parseFirstNumber(title) || null;

    if (!url || !title) return;
    if (number !== null && seenNumbers.has(number)) return;

    if (number !== null) {
      seenNumbers.add(number);
    }

    episodes.push({
      title,
      slug: slugFromPath(path),
      path,
      url,
      number,
    });
  });

  return episodes;
}
