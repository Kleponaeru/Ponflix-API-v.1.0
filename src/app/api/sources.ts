export interface SourceResponse {
  status: number;
  src: string;
  blog?: string;
  lib?: string;
}

export async function getSources(id: string): Promise<SourceResponse> {
  const response = await fetch("https://animeku.org/api/v9/sources", {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
      Origin: "https://kuronime.sbs",
      Pragma: "no-cache",
      Referer: "https://kuronime.sbs/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    },
    body: JSON.stringify({
      id,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sources (${response.status})`);
  }

  return response.json();
}
