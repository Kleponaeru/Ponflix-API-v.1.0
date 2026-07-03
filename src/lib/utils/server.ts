import type { EpisodeServer } from "@/types/episode";

export function selectPreferredServer(servers: EpisodeServer[]) {
  return (
    servers.find(
      (server) =>
        server.provider === "mirror" &&
        server.quality === "vip"
    ) ??
    servers.find(
      (server) =>
        server.provider === "filelions" &&
        server.quality === "v720p"
    ) ??
    servers[0] ??
    null
  );
}