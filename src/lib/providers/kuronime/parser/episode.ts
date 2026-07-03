import type { EpisodePlayer, EpisodeServer } from "@/types/episode";
import * as cheerio from "cheerio";

export function parseEpisode(html: string): EpisodePlayer {
  const $ = cheerio.load(html);

  const title =
    $("h1").first().text().trim() ||
    $(".entry-title").text().trim();

  const iframe =
    $("#iframedc").attr("src") ??
    $("#iframedc").attr("data-src") ??
    null;

  const servers: EpisodeServer[] = [];

  $("#mirrorList option").each((_, el) => {
    const option = $(el);

    const value = option.attr("value");
    const name = option.text().trim();

    if (!value || !name) return;

    const [rawQuality, provider] = value.split(",");

    const quality =
      rawQuality === "vip"
        ? "VIP"
        : rawQuality.replace(/^v/, "");

    servers.push({
      name,
      value,
      quality,
      provider,
    });
  });

  return {
    title,
    iframe,
    servers,
  };
}