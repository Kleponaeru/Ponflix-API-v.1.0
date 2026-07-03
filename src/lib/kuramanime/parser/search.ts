import * as cheerio from "cheerio";

import type { SearchAnime } from "@/types/search";

import { parseAnimeUrl } from "@/lib/utils/url";
import { parseNumber } from "@/lib/utils/number";

export function parseSearch(html: string): SearchAnime[] {
  const $ = cheerio.load(html);

  const animeList: SearchAnime[] = [];

  $(".product__item").each((_, element) => {
    const item = $(element);

    const anchor = item.find("> a");
    const url = anchor.attr("href") ?? "";

    const {
      animeId,
      slug,
      path,
    } = parseAnimeUrl(url);

    const scoreText = item.find(".ep span").text().trim();

    const commentsText = item
      .find(".fa-comments")
      .next("span")
      .text()
      .trim();

    const viewsText = item
      .find(".fa-eye")
      .next("span")
      .text()
      .trim();

    animeList.push({
      animeId,
      slug,

      title: item.find("h5 a").text().trim(),

      path,
      url,

      thumbnail:
        item.find(".product__item__pic").attr("data-setbg") ?? "",

      score: parseNumber(scoreText),

      type: item
        .find(".product__item__text li")
        .eq(0)
        .text()
        .trim(),

      quality: item
        .find(".product__item__text li")
        .eq(1)
        .text()
        .trim(),

      comments: parseNumber(commentsText),

      views: parseNumber(viewsText),
    });
  });

  return animeList;
}