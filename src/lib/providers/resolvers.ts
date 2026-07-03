export function resolveServer(value: string) {
  const [quality, provider] = value.split(",");

  return {
    quality,
    provider,
  };
}