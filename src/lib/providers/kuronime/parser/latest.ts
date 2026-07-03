import * as cheerio from "cheerio";

import { parseAnimeCard } from "./card";

import type { LatestAnime } from "@/types/latest";

import { parseNumber } from "@/lib/utils/number";

export function parseLatest(html: string): LatestAnime[] {
  const $ = cheerio.load(html);

  const animeList: LatestAnime[] = [];

  $("article.bsu").each((_, element) => {
    const item = $(element);

    const base = parseAnimeCard(item);

    const headline = item.find('h2[itemprop="headline"]').text().trim();

    const episodeMatch = headline.match(/Episode\s+(\d+)/i);

    const currentEpisode = episodeMatch
      ? Number(episodeMatch[1])
      : 0;

    animeList.push({
      ...base,

      title: headline
        .replace(/Episode\s+\d+/i, "")
        .replace(/Subtitle Indonesia/i, "")
        .trim(),

      currentEpisode,
      totalEpisodes: null,

      type: null,
      quality: null,

      hot: false,

      views: parseNumber(
        item.find(".post-views-count").text(),
      ),

      timeAgo: item.find(".time").text().trim() || null,
    });
  });

  return animeList;
}