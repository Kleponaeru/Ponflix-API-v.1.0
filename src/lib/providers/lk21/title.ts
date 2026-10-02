import type { Lk21MediaType } from "@/types/lk21";

import { lk21Client } from "./client";
import { parseLk21TitleDetails } from "./parser";

export async function getLk21Title(slug: string, type: Lk21MediaType) {
  const path = type === "series"
    ? `/nontondrama?page=${encodeURIComponent(slug)}`
    : `/${encodeURIComponent(slug)}`;
  const html = await lk21Client.get(path);
  return parseLk21TitleDetails(html, slug, type);
}
