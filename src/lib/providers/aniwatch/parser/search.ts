import * as cheerio from "cheerio";

import type { SearchAnime } from "@/types/search";

import {
  absoluteUrl,
  animeSlugFromEpisodeUrl,
  imageSource,
} from "./utils";

export function parseSearch(html: string): SearchAnime[] {
  const $ = cheerio.load(html);
  const results: SearchAnime[] = [];

  $(".film_list-wrap .flw-item").each((_, element) => {
    const item = $(element);
    const episodeUrl = absoluteUrl(
      item.find(".film-name a, .film-poster-ahref").first().attr("href") ?? "",
    );
    const slug = animeSlugFromEpisodeUrl(episodeUrl);

    if (!slug) return;

    const path = `/anime/${slug}/`;
    const titleElement = item.find(".film-name a").first();
    const title =
      titleElement.attr("data-en")?.trim() || titleElement.text().trim();

    results.push({
      slug,
      title,
      path,
      url: absoluteUrl(path),
      thumbnail: imageSource(item.find(".film-poster")),
      type: item.find(".fd-infor .fdi-item").first().text().trim() || null,
      score: null,
    });

  });

  return results;
}
