import { BASE_URL } from "@/constants";
import { getHTML } from "../../client/http";

class KuronimeClient {
  async get(path = "") {
    return getHTML(`${BASE_URL}${path}`);
  }
}

export const kuronimeClient = new KuronimeClient();