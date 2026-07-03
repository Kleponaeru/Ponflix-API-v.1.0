import * as cheerio from "cheerio";
import type { LatestAnime } from "@/types/latest";
import { parseAnimeUrl } from "@/lib/utils/url";

export function parseLatest(html: string): LatestAnime[] {
  const $ = cheerio.load(html);

  const animeList: LatestAnime[] = [];

  $(".product__item").each((_, element) => {
    const item = $(element);

    const anchor = item.find("> a");
    const url = anchor.attr("href") ?? "";

    const {
      animeId,
      slug,
      episode: episodeNumber,
      path,
    } = parseAnimeUrl(url);

    const episodeText = item.find(".ep span").text().trim();

    const episodeMatch = episodeText.match(
      /Ep\s+(\d+)\s*\/\s*(\d+|\?)/
    );

    const currentEpisode = episodeMatch
      ? Number(episodeMatch[1])
      : episodeNumber;

    const totalEpisodes =
      episodeMatch && episodeMatch[2] !== "?"
        ? Number(episodeMatch[2])
        : null;

    animeList.push({
      animeId,
      slug,
      title: item.find("h5 a").text().trim(),

      path,
      url,

      thumbnail:
        item.find(".product__item__pic").attr("data-setbg") ?? "",

      currentEpisode,
      totalEpisodes,

      type: item.find(".product__item__text li").eq(0).text().trim(),

      quality: item.find(".product__item__text li").eq(1).text().trim(),

      hot: item.find(".fa-fire").length > 0,
    });
  });

  return animeList;
}