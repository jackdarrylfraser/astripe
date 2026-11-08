import { activitySlug } from "./activity-slugs";

export function tagSlug(tag: string): string {
  return activitySlug(tag);
}

export function tagPath(tag: string): string {
  return `/tag/${encodeURIComponent(tagSlug(tag))}`;
}

export function isTagPath(path: string): boolean {
  const segment = path.match(/^\/tag\/([^/]+)\/?$/)?.[1];
  if (!segment) return false;

  try {
    const slug = decodeURIComponent(segment);
    return slug.length > 0 && tagSlug(slug) === slug && encodeURIComponent(slug) === segment;
  } catch (error) {
    if (error instanceof URIError) return false;
    throw error;
  }
}

export function hasActivityTag(tags: string[], slug: string): boolean {
  return tags.some((tag) => tagSlug(tag) === slug);
}

export function uniqueActivityTags(entries: { data: { tags: string[] } }[]): string[] {
  const tags = new Map<string, string>();
  for (const entry of entries) {
    for (const tag of entry.data.tags) {
      const slug = tagSlug(tag);
      if (!tags.has(slug)) tags.set(slug, tag);
    }
  }
  return [...tags.values()].sort((left, right) => left.localeCompare(right));
}
