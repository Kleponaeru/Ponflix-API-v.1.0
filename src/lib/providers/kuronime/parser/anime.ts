import * as cheerio from "cheerio";

import type { AnimeDetails } from "@/types/details";

import { parseNumber } from "@/lib/utils/number";

import { parseAnimeCard } from "./card";

export function parseAnime(html: string): AnimeDetails | null {
  const $ = cheerio.load(html);

  const article = $("article").first();

  if (article.length === 0) {
    return null;
  }

  const base = parseAnimeCard(article);

  const details = new Map<string, string>();

  $(".infodetail li").each((_, element) => {
    const item = $(element);

    const key = item.find("b").text().trim();

    const value = item
      .clone()
      .find("b")
      .remove()
      .end()
      .text()
      .replace(/^:\s*/, "")
      .trim();

    details.set(key, value);
  });

  const synopsis =
    $(".conx p").first().text().trim() || null;

  const score = (() => {
    const rating = $(".rating strong")
      .text()
      .match(/([\d.]+)/);

    return rating
      ? Number(rating[1])
      : null;
  })();

  const genres =
    details
      .get("Genre")
      ?.split(",")
      .map((genre) => genre.trim())
      .filter(Boolean) ?? [];

  const totalEpisodes = (() => {
    const value = details.get("Jumlah Episode");

    return value
      ? Number(value)
      : null;
  })();

  const views = parseNumber(
    $(".post-views-count")
      .first()
      .text(),
  );

  return {
    ...base,

    japaneseTitle:
      details.get("Judul") ?? null,

    synopsis,

    score,

    status:
      details.get("Status") ?? null,

    aired:
      details.get("Tayang") ?? null,

    type:
      details.get("Tipe") ?? null,

    duration:
      details.get("Durasi") ?? null,

    totalEpisodes,

    genres,

    views,

    updatedAt:
      details.get("Updated on") ?? null,
  };
}