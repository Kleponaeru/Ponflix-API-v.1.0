import * as cheerio from "cheerio";

import { parseAnimeCard } from "./card";

import type { SearchAnime } from "@/types/search";

export function parseSearch(html: string): SearchAnime[] {
  const $ = cheerio.load(html);

  const animeList: SearchAnime[] = [];

  $("article.bs").each((_, element) => {
    const item = $(element);

    const base = parseAnimeCard(item);

    const scoreText = item.find(".rating i").text().trim();

    animeList.push({
      ...base,

      title: item.find('h2[itemprop="headline"]').text().trim(),

      type: item.find(".type").text().trim() || null,

      score: scoreText ? Number(scoreText) : null,
    });
  });

  return animeList;
}