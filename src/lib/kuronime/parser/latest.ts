import * as cheerio from "cheerio";

import type { LatestAnime } from "@/types/latest";

import { parseNumber } from "@/lib/utils/number";

export function parseLatest(html: string): LatestAnime[] {
  const $ = cheerio.load(html);

  const animeList: LatestAnime[] = [];

  $("article.bsu").each((_, element) => {
    const item = $(element);

    const anchor = item.find("a").first();

    const url = anchor.attr("href") ?? "";

    const path = url ? new URL(url).pathname : "";

    const slug =
      path
        .replace(/^\/|\/$/g, "")
        .replace(/^nonton-/, "");

    const headline = item.find('h2[itemprop="headline"]').text().trim();

    const episodeMatch = headline.match(/Episode\s+(\d+)/i);

    const currentEpisode = episodeMatch
      ? Number(episodeMatch[1])
      : 0;

    const title = headline
      .replace(/Episode\s+\d+/i, "")
      .replace(/Subtitle Indonesia/i, "")
      .trim();

    animeList.push({
      animeId: null,

      slug,

      title,

      path,
      url,

      thumbnail:
        item.find('img[itemprop="image"]').attr("src") ?? "",

      currentEpisode,
      totalEpisodes: null,

      type: null,
      quality: null,

      hot: false,

      views: parseNumber(
        item.find(".post-views-count").text()
      ),

      timeAgo: item.find(".time").text().trim(),
    });
  });

  return animeList;
}