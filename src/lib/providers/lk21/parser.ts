import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";

import type {
  Lk21MediaType,
  Lk21Title,
  Lk21TitleDetails,
} from "@/types/lk21";

import { LK21_BASE_URL } from "./client";

const POSTER_BASE_URL = "https://poster.assetsy.de/wp-content/uploads/";

function absoluteUrl(value: string) {
  try {
    return new URL(value, LK21_BASE_URL).toString();
  } catch {
    return "";
  }
}

function parseIntOrNull(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseFloatOrNull(value: string) {
  const match = value.match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function slugFromPath(path: string, type: Lk21MediaType) {
  if (type === "series") {
    try {
      return new URL(path, LK21_BASE_URL).searchParams.get("page") ?? "";
    } catch {
      return "";
    }
  }

  return path.split("/").filter(Boolean).at(-1) ?? "";
}

function parseCard(
  $: cheerio.CheerioAPI,
  element: AnyNode,
  forcedType?: Lk21MediaType,
): Lk21Title | null {
  const item = $(element);
  const anchor = item.find('a[itemprop="url"]').first();
  const path = anchor.attr("href")?.trim() ?? "";
  const isSeries = forcedType === "series" || path.startsWith("/nontondrama");
  const type: Lk21MediaType = isSeries ? "series" : "movie";
  const slug = slugFromPath(path, type);
  const title =
    item.find('.poster-title, [itemprop="name"]').first().text().trim() ||
    item.find("img[alt]").first().attr("alt")?.trim().replace(/\s*\(\d{4}\)$/, "") ||
    "";

  if (!slug || !title) return null;

  const poster = item.find('img[itemprop="image"]').first();
  const rawPoster =
    poster.attr("src") ||
    poster.attr("data-src") ||
    item.find("picture source").first().attr("srcset") ||
    "";
  const posterUrl = rawPoster
    ? rawPoster.startsWith("http")
      ? rawPoster
      : new URL(rawPoster.replace(/^\//, ""), POSTER_BASE_URL).toString()
    : null;
  const seasonText = item.find(".duration").first().text().trim();
  const episodeElement = item.find(".episode").first();
  const episode = isSeries
    ? parseIntOrNull(episodeElement.find("strong").first().text().trim())
    : null;
  const seasonMatch = seasonText.match(/(?:S\.?\s*)(\d+)/i);
  const genres = (item.find(".genre").first().text().trim() || "")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
  const year = parseIntOrNull(item.find(".year").first().text().trim());
  const ratingText =
    item.find('[itemprop="ratingValue"]').first().text().trim() ||
    item.find(".rating").first().text().trim();
  const runtime = isSeries
    ? null
    : item.find(".duration").first().text().trim() || null;
  const quality = item.find(".label").first().text().trim() || null;
  const pathForApi = path.startsWith("/") ? path : `/${path}`;

  return {
    id: null,
    type,
    slug,
    title,
    path: pathForApi,
    url: absoluteUrl(pathForApi),
    thumbnail: posterUrl,
    year,
    rating: parseFloatOrNull(ratingText),
    quality,
    runtime,
    genres,
    episode,
    season: isSeries ? parseIntOrNull(seasonMatch?.[1]) : null,
    complete: isSeries ? episodeElement.hasClass("complete") : null,
  };
}

export function parseLk21Cards(
  html: string,
  selector: string,
  forcedType?: Lk21MediaType,
) {
  const $ = cheerio.load(html);
  const container = $(selector).first();
  const results: Lk21Title[] = [];
  const seen = new Set<string>();

  container.find("article").each((_, element) => {
    const item = parseCard($, element, forcedType);
    if (!item || seen.has(item.path)) return;
    seen.add(item.path);
    results.push(item);
  });

  return results;
}

export function parseLk21Search(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    throw new Error("LK21 search returned an invalid response");
  }

  const value = payload as {
    data?: unknown;
    items?: unknown;
    totalPages?: number;
    total_pages?: number;
    error?: string;
  };

  if (value.error) throw new Error(value.error);

  const rows = Array.isArray(value.data)
    ? value.data
    : Array.isArray(value.items)
      ? value.items
      : [];

  const data = rows.flatMap((row): Lk21Title[] => {
    if (!row || typeof row !== "object") return [];

    const item = row as Record<string, unknown>;
    const type: Lk21MediaType = item.type === "series" ? "series" : "movie";
    const slug = typeof item.slug === "string" ? item.slug : "";
    const title = typeof item.title === "string" ? item.title.trim() : "";
    if (!slug || !title) return [];

    const path =
      type === "series"
        ? `/nontondrama?page=${encodeURIComponent(slug)}`
        : `/${encodeURIComponent(slug)}`;
    const poster = typeof item.poster === "string" ? item.poster : "";

    return [
      {
        id: typeof item.id === "string" ? item.id : null,
        type,
        slug,
        title,
        path,
        url: absoluteUrl(path),
        thumbnail: poster
          ? poster.startsWith("http")
            ? poster
            : new URL(poster.replace(/^\//, ""), POSTER_BASE_URL).toString()
          : null,
        year: typeof item.year === "number" ? item.year : null,
        rating: typeof item.rating === "number" ? item.rating : null,
        quality: typeof item.quality === "string" && item.quality ? item.quality : null,
        runtime: typeof item.runtime === "string" && item.runtime ? item.runtime : null,
        genres: [],
        episode:
          type === "series" && typeof item.episode === "number" ? item.episode : null,
        season:
          type === "series" && typeof item.season === "number" ? item.season : null,
        complete:
          type === "series" && typeof item.is_complete === "number"
            ? item.is_complete === 1
            : null,
      },
    ];
  });

  return {
    data,
    totalPages:
      typeof value.totalPages === "number"
        ? value.totalPages
        : typeof value.total_pages === "number"
          ? value.total_pages
          : 1,
  };
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asStringList(value: unknown): string[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return values.flatMap((item) => {
    if (typeof item === "string") return [item.trim()].filter(Boolean);
    if (item && typeof item === "object" && "name" in item) {
      const name = (item as { name?: unknown }).name;
      return typeof name === "string" && name.trim() ? [name.trim()] : [];
    }
    return [];
  });
}

export function parseLk21TitleDetails(
  html: string,
  slug: string,
  type: Lk21MediaType,
): Lk21TitleDetails {
  const $ = cheerio.load(html);
  let history: Record<string, unknown> = {};
  try {
    const parsed: unknown = JSON.parse($("#watch-history-data").text());
    if (parsed && typeof parsed === "object") history = parsed as Record<string, unknown>;
  } catch {
    // Some pages omit the optional watch history payload.
  }

  let schema: Record<string, unknown> = {};
  $("script[type='application/ld+json']").each((_, element) => {
    if (Object.keys(schema).length) return;
    try {
      const parsed: unknown = JSON.parse($(element).text());
      const candidates = parsed && typeof parsed === "object" && "@graph" in parsed
        ? (parsed as { "@graph"?: unknown[] })["@graph"] ?? []
        : [parsed];
      const match = candidates.find(
        (candidate) => candidate && typeof candidate === "object" &&
          ["Movie", "TVSeries", "CreativeWork"].includes(
            String((candidate as Record<string, unknown>)["@type"]),
          ),
      );
      if (match && typeof match === "object") schema = match as Record<string, unknown>;
    } catch {
      // Ignore unrelated or malformed JSON-LD blocks.
    }
  });

  const title =
    asString(history.title) ||
    asString(schema.name)?.replace(/^Lk21 Nonton\s+/i, "").replace(/\s+Sub Indo\s*\|.*$/i, "") ||
    $("h1").first().text().trim() ||
    slug;
  const poster = asString(history.poster) || asString(schema.image);
  const rawRating = history.rating ??
    (schema.aggregateRating && typeof schema.aggregateRating === "object"
      ? (schema.aggregateRating as Record<string, unknown>).ratingValue
      : null);
  const rating = typeof rawRating === "number"
    ? rawRating
    : typeof rawRating === "string" ? parseFloatOrNull(rawRating) : null;
  const serverElements = $("#player-list a");
  const servers = serverElements.toArray().flatMap((element) => {
    const item = $(element);
    const rawUrl = item.attr("data-url") || item.attr("href") || "";
    try {
      const url = new URL(rawUrl, LK21_BASE_URL);
      if (url.protocol !== "https:" && url.protocol !== "http:") return [];
      return [{
        name: item.text().trim() || item.attr("data-server") || "Player",
        url: url.toString(),
        selected: item.hasClass("active") || item.attr("aria-current") === "true",
      }];
    } catch {
      return [];
    }
  });
  const embedUrl = $("#main-player iframe").first().attr("src") ||
    $(".main-player iframe").first().attr("src") || null;
  const canonicalPath = type === "series"
    ? `/nontondrama?page=${encodeURIComponent(slug)}`
    : `/${encodeURIComponent(slug)}`;
  const yearValue = history.year ?? schema.datePublished;
  const year = typeof yearValue === "number"
    ? yearValue
    : typeof yearValue === "string" ? parseIntOrNull(yearValue.slice(0, 4)) : null;
  const runtime = asString(history.runtime) || asString(schema.duration);
  const genre = asStringList(schema.genre);
  const description = asString($("meta[name='description']").attr("content")) ||
    asString(schema.description);
  const detailText = $(".movie-details, .film-detail, .detail-info").first().text();
  const listFrom = (value: unknown, fallback: string) =>
    asStringList(value).length ? asStringList(value) : fallback.split(",").map((item) => item.trim()).filter(Boolean);
  const stat = (key: string) =>
    detailText.match(new RegExp(`${key}\\s*:\\s*([^\\n]+?)(?=(?:Sutradara|Bintang Film|Negara|Votes|Release|Updated)\\s*:|$)`, "i"))?.[1].trim() ?? "";

  return {
    id: typeof history.id === "string" || typeof history.id === "number"
      ? String(history.id)
      : null,
    type,
    slug,
    title,
    path: canonicalPath,
    url: absoluteUrl(canonicalPath),
    thumbnail: poster ? absoluteUrl(poster) : null,
    year,
    rating,
    quality: $(".label-quality, .quality").first().text().trim() || null,
    runtime,
    genres: genre,
    episode: null,
    season: null,
    complete: null,
    description,
    director: listFrom(schema.director, stat("Sutradara")),
    cast: listFrom(schema.actor, stat("Bintang Film")),
    country: listFrom(schema.countryOfOrigin, stat("Negara")),
    servers,
    embedUrl: embedUrl ? absoluteUrl(embedUrl) : null,
  };
}
