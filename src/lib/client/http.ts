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

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
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
  options?: HttpOptions
): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${response.statusText}`
    );
  }

  return await response.text();
}

