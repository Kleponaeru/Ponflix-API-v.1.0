import * as cheerio from "cheerio";

import type { LatestAnime } from "@/types/latest";
import {
  absoluteUrl,
  imageSource,
  parseFirstNumber,
  pathFromUrl,
  slugFromPath,
} from "./utils";

export function parseLatest(html: string): LatestAnime[] {
  const $ = cheerio.load(html);
  const animeList: LatestAnime[] = [];
  const seen = new Set<string>();

  $(".deslide-item").each((_, element) => {
    const item = $(element);

    if (item.closest(".swiper-slide").hasClass("swiper-slide-duplicate")) {
      return;
    }

    const detailUrl = absoluteUrl(
      item.find(".desi-buttons a.btn-secondary").attr("href") ?? "",
    );
    const path = pathFromUrl(detailUrl);
    const slug = slugFromPath(path);

    if (!slug || seen.has(slug)) {
      return;
    }

    const titleElement = item.find(".desi-head-title").first();
    const title =
      titleElement.attr("data-en")?.trim() || titleElement.text().trim();
    const thumbnail =
      imageSource(item.find(".deslide-cover-img"));

    seen.add(slug);
    animeList.push({
      slug,
      title,
      path,
      url: detailUrl,
      thumbnail,
      currentEpisode: parseFirstNumber(item.find(".tick-sub").first().text()),
      totalEpisodes: null,
      type: item.find(".sc-detail .scd-item").first().text().trim() || null,
      quality: item.find(".quality").first().text().trim() || null,
      hot: false,
      views: null,
      timeAgo: null,
    });
  });

  return animeList;
}
