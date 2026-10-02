import type { Lk21SearchPayload } from "@/types/lk21";

import { lk21Client } from "./client";
import { parseLk21Search } from "./parser";

export async function searchLk21(
  query: string,
  page = 1,
): Promise<Lk21SearchPayload> {
  const payload = await lk21Client.search(query, page);
  return parseLk21Search(payload) as Lk21SearchPayload;
}
