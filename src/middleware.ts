import { clerkMiddleware } from "@clerk/astro/server";
import type { AuthFn } from "@clerk/astro/server";
import type { APIContext, MiddlewareHandler } from "astro";

declare const process: { env: Record<string, string | undefined> } | undefined;

export function assertClerkConfigured(
  publishableKey: string | undefined,
  secretKey: string | undefined,
) {
  const missing = [
    !publishableKey?.trim() && "PUBLIC_CLERK_PUBLISHABLE_KEY",
    !secretKey?.trim() && "CLERK_SECRET_KEY",
  ].filter(Boolean);

  if (missing.length) {
    throw new Error(
      `Missing Clerk environment variables: ${missing.join(", ")}. ` +
        "Set both keys from the same Clerk application in .env or your deployment environment. " +
        "See the README's Getting started section.",
    );
  }
}

export async function protectMembers(
  auth: AuthFn,
  context: APIContext,
  next: () => Promise<Response>,
) {
  const { pathname } = context.url;
  if (pathname !== "/members" && !pathname.startsWith("/members/")) {
    return next();
  }

  const { userId, has, redirectToSignIn } = auth();
  let response: Response;

  if (!userId) {
    response = redirectToSignIn();
  } else if (!has({ feature: "user:site_access" })) {
    response = context.redirect("/pricing");
  } else {
    response = await next();
  }

  const privateResponse = new Response(response.body, response);
  privateResponse.headers.set("Cache-Control", "private, no-store");
  return privateResponse;
}

const clerk = clerkMiddleware(protectMembers);

export const onRequest: MiddlewareHandler = (context, next) => {
  const runtimeEnv = typeof process === "undefined" ? undefined : process.env;
  assertClerkConfigured(
    runtimeEnv?.PUBLIC_CLERK_PUBLISHABLE_KEY || import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY,
    runtimeEnv?.CLERK_SECRET_KEY || import.meta.env.CLERK_SECRET_KEY,
  );
  return clerk(context, next);
};
