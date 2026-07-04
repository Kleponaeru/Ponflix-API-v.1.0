import * as cheerio from "cheerio";
import type { EpisodePlayer } from "@/types/episode";

export function parseEpisode(html: string): EpisodePlayer | null {
  const $ = cheerio.load(html);

  const title =
    $("h1").first().text().trim() ||
    $(".entry-title").text().trim() ||
    "";

  const iframe =
    $("#iframedc").attr("data-src") ??
    $("#iframedc").attr("src") ??
    "";

  const scripts = $("script")
    .map((_, el) => $(el).html() ?? "")
    .get()
    .join("\n");

  const sourceMatch = scripts.match(
    /var\s+_0xa100d42aa\s*=\s*"([^"]+)"/
  );

  const xenMatch = scripts.match(
    /var\s+xenHash\s*=\s*"([^"]+)"/
  );

  const sourceId = sourceMatch?.[1] ?? null;
  const xenHash = xenMatch?.[1] ?? null;

  if (!sourceId) return null;

  return {
    title,
    iframe,
    sourceId,
    xenHash,
    servers: [],
  };
}