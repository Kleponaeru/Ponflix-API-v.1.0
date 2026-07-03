import type { Cheerio } from "cheerio";
import type { Element } from "domhandler";

import type { AnimeBase } from "@/types/anime";

export function parseAnimeCard(
  item: Cheerio<Element>,
): AnimeBase {
  const anchor = item.find("a").first();

  const url = anchor.attr("href") ?? "";

  const path = url ? new URL(url).pathname : "";

  const slug = path
    .replace(/^\/|\/$/g, "")
    .replace(/^anime\//, "")
    .replace(/^nonton-/, "")
    .replace(/\/episode\/.*$/, "");

  const thumbnail =
    item.find('[itemprop="image"]').attr("src") ??
    item.find(".product__item__pic").attr("data-setbg") ??
    "";

  return {
    slug,
    title: "",
    path,
    url,
    thumbnail,
  };
}