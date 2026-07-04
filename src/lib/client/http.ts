export async function request(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, init);
}

export async function requestJson<T>(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, init);

  const text = await response.text();

  console.log("RAW RESPONSE:", text.slice(0, 300));

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return JSON.parse(text) as T;
}

export async function requestText(
  input: string | URL | Request,
  init?: RequestInit,
): Promise<string> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.text();
}

export interface HttpOptions {
  headers?: HeadersInit;
}

export async function getHTML(
  url: string,
  options?: HttpOptions,
): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
      "Accept":
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": "https://kuronime.sbs/",
      "Cache-Control": "no-cache",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
}

