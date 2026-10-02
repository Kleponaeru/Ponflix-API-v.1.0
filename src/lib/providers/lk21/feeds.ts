import { lk21Client } from "./client";
import { parseLk21Cards } from "./parser";

export async function getLatestLk21Movies() {
  const html = await lk21Client.get("/latest");
  return parseLk21Cards(html, ".gallery-grid", "movie");
}

export async function getLk21LatestMoviesWidget() {
  const html = await lk21Client.get("/");
  return parseLk21Cards(html, '.widget[data-type="latest-movies"]', "movie");
}

export async function getLk21TopSeries() {
  const html = await lk21Client.get("/");
  return parseLk21Cards(html, '.widget[data-type="top-series-today"]', "series");
}
