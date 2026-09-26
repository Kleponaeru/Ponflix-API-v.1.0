import { ANIWATCH_BASE_URL } from "@/constants";
import { getHTML } from "@/lib/client/http";

class AniwatchClient {
  async get(path = "") {
    const url = new URL(path, ANIWATCH_BASE_URL).toString();

    return getHTML(url, {
      headers: {
        Referer: `${ANIWATCH_BASE_URL}/`,
      },
    });
  }
}

export const aniwatchClient = new AniwatchClient();
