import { isActivityPath } from "./activity-slugs";
import { isTagPath } from "./activity-tags";

const destinations = new Set(["/account", "/activities", "/tags", "/subscribe"]);

export function authDestination(url: URL): string {
  const destination = url.searchParams.get("redirect_url");
  return destination && (destinations.has(destination) || isActivityPath(destination) || isTagPath(destination)) ? destination : "/";
}

export function authPath(path: "/sign-in" | "/sign-up", destination: string): string {
  return `${path}?${new URLSearchParams({ redirect_url: destination })}`;
}
