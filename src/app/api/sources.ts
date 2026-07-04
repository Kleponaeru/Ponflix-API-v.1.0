export interface SourceResponse {
  status: number;
  src: string;
  blog?: string;
  lib?: string;
}

export async function getSources(id: string): Promise<SourceResponse> {
  const response = await fetch("https://animeku.org/api/v9/sources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sources (${response.status})`);
  }

  return response.json();
}