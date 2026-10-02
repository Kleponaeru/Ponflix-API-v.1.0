import { getHTML, requestText } from "@/lib/client/http";

export const LK21_BASE_URL = "https://tv12.lk21official.cc";
const LK21_SEARCH_API_URL = "https://gudangvape.com/search.php";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";

export const lk21Client = {
  get(path: string) {
    const url = new URL(path, LK21_BASE_URL).toString();

    return getHTML(url, {
      headers: {
        Referer: `${LK21_BASE_URL}/`,
      },
    });
  },

  async search(query: string, page = 1) {
    const url = new URL(LK21_SEARCH_API_URL);
    url.searchParams.set("s", query);
    url.searchParams.set("page", String(page));

    const responseText = await requestText(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest",
        Referer: `${LK21_BASE_URL}/search?s=${encodeURIComponent(query)}`,
      },
    });

    return JSON.parse(responseText) as unknown;
  },
};
