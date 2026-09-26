import { aniwatchClient } from "./client";
import { fetchEpisodeServers } from "./api";
import { parseEpisode } from "./parser/episode";

export async function getEpisode(slug: string) {
  const pageHtml = await aniwatchClient.get(`/${slug}/`);
  const page = parseEpisode(pageHtml);

  if (!page?.sourceId) return page;

  const serverHtml = await fetchEpisodeServers(page.sourceId);

  return parseEpisode(pageHtml, serverHtml);
}
