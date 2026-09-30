import * as cheerio from "cheerio";

import type { LatestAnime } from "@/types/latest";

import {
  absoluteUrl,
  animeSlugFromEpisodeUrl,
  imageSource,
  parseFirstNumber,
} from "./utils";

export function parseLatestCompleted(html: string): LatestAnime[] {
  const $ = cheerio.load(html);
  const results: LatestAnime[] = [];
  const seen = new Set<string>();
  const completedBlock = $(".anif-block").filter((_, element) =>
    $(element).find(".anif-block-header").text().trim() === "Latest Completed",
  ).first();
  const items = completedBlock.length
    ? completedBlock.find("li")
    : $(".film_list-wrap .flw-item");

  items.each((_, element) => {
    const item = $(element);
    const sourceUrl = absoluteUrl(item.find("a").first().attr("href") ?? "");
    const slug = animeSlugFromEpisodeUrl(sourceUrl);
    const path = slug ? `/anime/${slug}/` : "";
    const url = absoluteUrl(path);
    const titleElement = item.find(".film-name a").first();
    const title =
      titleElement.attr("data-en")?.trim() || titleElement.text().trim();
    const currentEpisode = parseFirstNumber(item.find(".tick-sub").first().text());
    const totalEpisodes = parseFirstNumber(item.find(".tick-eps").first().text()) || null;

    if (!slug || seen.has(slug)) return;

    seen.add(slug);
    results.push({
      slug,
      title,
      path,
      url,
      thumbnail: imageSource(item.find(".film-poster")),
      currentEpisode,
      totalEpisodes,
      type: item.find(".fdi-item").first().text().trim() || null,
      quality: item.find(".tick-quality, .quality").first().text().trim() || null,
      hot: false,
      views: null,
      timeAgo: null,
    });
  });

  return results;
}
