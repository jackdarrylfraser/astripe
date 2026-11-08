import type { APIContext } from "astro";
import { authPath } from "./auth-redirect";

type Auth = ReturnType<APIContext["locals"]["auth"]>;

export function memberAccessRedirect(auth: Auth, destination: string): string | null {
  if (!auth.userId) return authPath("/sign-in", destination);
  if (!auth.has({ feature: "user:site_access" })) return "/subscribe";
  return null;
}
