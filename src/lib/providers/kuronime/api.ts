import { API_URL, BASE_URL } from "@/constants";
import { requestJson } from "@/lib/client/http";

export interface SourcesResponse {
  status: number;
  token: string;
  blog: string | null;
  src: string;
  src_sd?: string | null;
  mirror?: string | null;
}

export async function fetchEpisodeSources(
  sourceId: string,
  xenHash?: string | null,
) {
  return requestJson<SourcesResponse>(
    `${API_URL}/api/v9/sources`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: BASE_URL,
      },
      body: JSON.stringify({
        id: sourceId,
        xen_hash: xenHash,
      }),
    },
  );
}