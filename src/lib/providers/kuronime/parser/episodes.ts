import { BASE_URL } from "@/constants";
import * as cheerio from "cheerio";

export function parseEpisodes(html: string) {
  const $ = cheerio.load(html);

  const results: any[] = [];

  $("li").each((_, el) => {
    const a = $(el).find(".lchx a");

    const title = a.text().trim();
    const href = a.attr("href");

    if (!title || !href) return;

    const url = href.startsWith("http") ? href : `${BASE_URL}${href}`;

    const path = new URL(url).pathname;
    const slug = path.split("/").filter(Boolean).pop() || "";

    results.push({
      title,
      slug,
      url,
      path,
    });
  });

  return results;
}
