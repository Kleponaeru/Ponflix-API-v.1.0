import type { AnimeBase } from "@/types/anime";

export function parseAnimeCard(item: any): AnimeBase {
  const anchor = item.find("a").first();

  const url = anchor.attr("href") ?? "";

  const path = url
    ? new URL(url).pathname
    : "";

  const slug = path
    .replace(/^\/|\/$/g, "")
    .replace(/^anime\//, "")
    .replace(/^nonton-/, "")
    .replace(/\/episode\/.*$/, "");

  const title =
    item.find('h1[itemprop="name"]').text().trim() ||
    item.find('h2[itemprop="headline"]').text().trim() ||
    item.find("h5 a").text().trim();

  const thumbnail =
    item.find('img[itemprop="image"]').attr("src") ??
    item.find(".product__item__pic").attr("data-setbg") ??
    "";

  return {
    slug,
    title,
    path,
    url,
    thumbnail,
  };
}