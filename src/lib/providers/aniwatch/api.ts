import { ANIWATCH_BASE_URL } from "@/constants";
import { requestJson } from "@/lib/client/http";

const REST_URL = `${ANIWATCH_BASE_URL}/wp-json/v1/otakuthemes/`;

interface AniwatchHtmlResponse {
  status: boolean;
  html?: string;
}

async function getHtml(path: string) {
  const response = await requestJson<AniwatchHtmlResponse>(
    `${REST_URL}${path}`,
    {
      headers: {
        Accept: "application/json",
        Referer: `${ANIWATCH_BASE_URL}/`,
      },
      cache: "no-store",
    },
  );

  return response.status ? response.html ?? "" : "";
}

export function fetchEpisodeList(animeId: string) {
  return getHtml(`episode/list/${encodeURIComponent(animeId)}`);
}

export function fetchEpisodeServers(episodeId: string) {
  return getHtml(`episode/servers?episodeId=${encodeURIComponent(episodeId)}`);
}
