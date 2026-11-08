import { describe, expect, test } from "bun:test";
import { assertClerkConfigured, protectMembers } from "../src/middleware.ts";

describe("Clerk configuration", () => {
  test("reports the names of missing keys without including their values", () => {
    expect(() => assertClerkConfigured(undefined, undefined)).toThrow(
      "Missing Clerk environment variables: PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY",
    );
    expect(() => assertClerkConfigured("pk_test_example", "")).toThrow(
      "Missing Clerk environment variables: CLERK_SECRET_KEY",
    );
    expect(() => assertClerkConfigured(" ", "sk_test_example")).toThrow(
      "Missing Clerk environment variables: PUBLIC_CLERK_PUBLISHABLE_KEY",
    );
  });

  test("accepts configured keys", () => {
    expect(() => assertClerkConfigured("pk_test_example", "sk_test_example")).not.toThrow();
  });
});

function request(path, authState) {
  let nextCalls = 0;
  let authCalls = 0;
  const featureChecks = [];
  const auth = () => {
    authCalls++;
    return {
      userId: authState.userId,
      has: (condition) => {
        featureChecks.push(condition);
        return authState.hasAccess;
      },
      redirectToSignIn: () => Response.redirect("https://clerk.example/sign-in"),
    };
  };
  const context = {
    url: new URL(path, "https://example.com"),
    redirect: (location) => new Response(null, { status: 302, headers: { Location: location } }),
  };
  const next = async () => {
    nextCalls++;
    return new Response("Members content");
  };

  return {
    run: () => protectMembers(auth, context, next),
    calls: () => ({ nextCalls, authCalls, featureChecks }),
  };
}

describe("members access", () => {
  test("does not protect public pages or similarly named paths", async () => {
    for (const path of ["/", "/pricing", "/membership"]) {
      const req = request(path, {});
      const response = await req.run();
      expect(response.status).toBe(200);
      expect(req.calls()).toEqual({ nextCalls: 1, authCalls: 0, featureChecks: [] });
    }
  });

  test("redirects signed-out visitors to sign in without rendering content", async () => {
    const req = request("/members", { userId: null });
    const response = await req.run();
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("https://clerk.example/sign-in");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(req.calls()).toEqual({ nextCalls: 0, authCalls: 1, featureChecks: [] });
  });

  test("redirects users without access to pricing", async () => {
    const req = request("/members/", { userId: "user_1", hasAccess: false });
    const response = await req.run();
    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/pricing");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(req.calls()).toEqual({
      nextCalls: 0,
      authCalls: 1,
      featureChecks: [{ feature: "user:site_access" }],
    });
  });

  test("allows entitled users and protects nested routes", async () => {
    const req = request("/members/content", { userId: "user_1", hasAccess: true });
    const response = await req.run();
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("Members content");
    expect(response.headers.get("cache-control")).toBe("private, no-store");
    expect(req.calls()).toEqual({
      nextCalls: 1,
      authCalls: 1,
      featureChecks: [{ feature: "user:site_access" }],
    });
  });
});
