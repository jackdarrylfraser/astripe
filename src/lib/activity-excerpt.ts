const excerptMarker = /^<!--\s*excerpt\s*-->[ \t]*$/m;

export function activityExcerpt(renderedHtml: string | undefined): string | undefined {
  if (!renderedHtml) return undefined;

  const marker = excerptMarker.exec(renderedHtml);
  if (!marker) return undefined;

  return renderedHtml.slice(0, marker.index).trim() || undefined;
}
