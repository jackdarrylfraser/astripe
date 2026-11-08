export function activitySlug(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function activityPath(slug: string): string {
  return `/activities/${encodeURIComponent(slug)}`;
}

export function isActivityPath(path: string): boolean {
  const segment = path.match(/^\/activities\/([^/]+)$/)?.[1];
  if (!segment) return false;

  try {
    const slug = decodeURIComponent(segment);
    return slug.length > 0 && activitySlug(slug) === slug && encodeURIComponent(slug) === segment;
  } catch (error) {
    if (error instanceof URIError) return false;
    throw error;
  }
}

export function activitiesWithSlugs<T extends { id: string; data: { title: string } }>(
  entries: T[],
): { entry: T; slug: string }[] {
  const used = new Map<string, string>();
  return entries.map((entry) => {
    const slug = activitySlug(entry.data.title);
    if (!slug) {
      throw new Error(`Activity "${entry.id}" has a title that cannot produce a slug.`);
    }
    const previous = used.get(slug);
    if (previous !== undefined) {
      throw new Error(`Activities "${previous}" and "${entry.id}" have the same title slug "${slug}".`);
    }
    used.set(slug, entry.id);
    return { entry, slug };
  });
}
