export function compactWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

export function slugify(value: string) {
  return compactWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

