import { BASE_URL } from "@/constants";
import { getHTML } from "../client/http";

class KuramanimeClient {
  async get(path = "") {
    return getHTML(`${BASE_URL}${path}`);
  }
}

export const kuramanimeClient = new KuramanimeClient();