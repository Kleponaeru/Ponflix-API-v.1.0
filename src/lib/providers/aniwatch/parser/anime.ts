import * as cheerio from "cheerio";

import type { AnimeDetails } from "@/types/details";

import {
  absoluteUrl,
  animeSlugFromEpisodeUrl,
  imageSource,
  parseFirstNumber,
  pathFromUrl,
  slugFromPath,
} from "./utils";

function getInfoItem($: cheerio.CheerioAPI, label: string) {
  return $(".anisc-info .item").filter((_, element) => {
    const head = $(element).find(".item-head").text().trim();

    return head.replace(/:$/, "") === label;
  }).first();
}

function getInfoValue($: cheerio.CheerioAPI, label: string) {
  return getInfoItem($, label).find(".name").first().text().trim() || null;
}

function getNumericInfoValue($: cheerio.CheerioAPI, label: string) {
  const value = getInfoValue($, label);

  return value ? Number(value.match(/[\d.]+/)?.[0] ?? NaN) || null : null;
}

export function parseAnime(html: string): AnimeDetails | null {
  const $ = cheerio.load(html);
  const detail = $("#ani_detail").first();

  if (detail.length === 0) return null;

  const canonicalUrl = absoluteUrl($("link[rel='canonical']").attr("href") ?? "");
  const titleElement = detail.find(".anisc-detail h2.film-name").first();
  const title =
    titleElement.attr("data-en")?.trim() || titleElement.text().trim();
  const watchUrl = absoluteUrl(
    detail.find(".film-buttons .btn-play").attr("href") ?? "",
  );
  const url = canonicalUrl || absoluteUrl(
    `/anime/${animeSlugFromEpisodeUrl(watchUrl)}/`,
  );
  const path = pathFromUrl(url);
  const stats = detail.find(".film-stats").first();
  const statItems = stats.find(".item").map((_, element) => $(element).text().trim()).get();
  const synopsisElement = detail.find(".film-description .text").first().clone();

  synopsisElement.find(".btn-more-desc").remove();

  return {
    slug: slugFromPath(path),
    title,
    path,
    url,
    thumbnail: imageSource(detail.find(".anisc-poster")),
    japaneseTitle: getInfoValue($, "Japanese") ?? titleElement.attr("data-jname") ?? null,
    synopsis: synopsisElement.text().replace(/\s+/g, " ").trim() || null,
    score: getNumericInfoValue($, "MAL Score"),
    status: getInfoValue($, "Status"),
    aired: getInfoValue($, "Aired"),
    type: statItems[0] || null,
    duration: getInfoValue($, "Duration") ?? statItems.at(-1) ?? null,
    totalEpisodes: parseFirstNumber(stats.find(".tick-eps").first().text()) || null,
    genres: getInfoItem($, "Genres").find("a").map((_, element) => $(element).text().trim()).get(),
    views: null,
    updatedAt: $("meta[property='article:modified_time']").attr("content") ?? null,
  };
}
