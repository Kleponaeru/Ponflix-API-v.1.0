import * as cheerio from "cheerio";

import type { TrendingAnime } from "@/types/trending";

import {
  absoluteUrl,
  imageSource,
  parseFirstNumber,
  pathFromUrl,
  slugFromPath,
} from "./utils";

export function parseTrending(html: string): TrendingAnime[] {
  const $ = cheerio.load(html);
  const results: TrendingAnime[] = [];
  const seen = new Set<string>();

  $(".trending-list .swiper-slide").each((_, element) => {
    const slide = $(element);

    if (slide.hasClass("swiper-slide-duplicate")) return;

    const item = slide.find(".item").first();
    const url = absoluteUrl(item.find(".film-poster").attr("href") ?? "");
    const path = pathFromUrl(url);
    const slug = slugFromPath(path);
    const titleElement = item.find(".film-title").first();
    const title =
      titleElement.attr("data-en")?.trim() || titleElement.text().trim();

    if (!slug || seen.has(slug)) return;

    seen.add(slug);
    results.push({
      slug,
      title,
      path,
      url,
      thumbnail: imageSource(item.find(".film-poster")),
      rank: parseFirstNumber(item.find(".number span").text()) || null,
    });
  });

  return results;
}
