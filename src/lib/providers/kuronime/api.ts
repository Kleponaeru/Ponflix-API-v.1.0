import { API_URL, BASE_URL } from "@/constants";
import { requestJson } from "@/lib/client/http";

export interface SourcesResponse {
  status: number;
  token?: string;
  blog?: string | null;
  src: string;
  src_sd?: string | null;
  mirror?: string | null;
}

const SOURCE_HEADERS: HeadersInit = {
  Accept: "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Content-Type": "application/json",
  Origin: BASE_URL,
  Pragma: "no-cache",
  Referer: `${BASE_URL}/`,
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
};

async function postSources(body: Record<string, string>) {
  return requestJson<SourcesResponse>(`${API_URL}/api/v9/sources`, {
    method: "POST",
    headers: SOURCE_HEADERS,
    body: JSON.stringify(body),
    cache: "no-store",
  });
}

export async function fetchEpisodeSources(
  sourceId: string,
  xenHash?: string | null,
) {
  try {
    return await postSources({
      id: sourceId,
      ...(xenHash ? { xen_hash: xenHash } : {}),
    });
  } catch (error) {
    console.warn("Primary episode source lookup failed", {
      sourceId,
      xenHash,
      error,
    });

    if (!xenHash) {
      return null;
    }

    try {
      return await postSources({ id: sourceId });
    } catch (fallbackError) {
      console.warn("Fallback episode source lookup failed", {
        sourceId,
        fallbackError,
      });
      return null;
    }
  }
}
