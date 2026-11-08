import { describe, expect, test } from "bun:test";
import { authDestination, authPath } from "../src/lib/auth-redirect";
import { getPublicUserPlans } from "../src/lib/billing";
import { activitiesWithSlugs, activityPath, activitySlug } from "../src/lib/activity-slugs";
import { activityExcerpt } from "../src/lib/activity-excerpt";
import { activitySchema } from "../src/lib/activity-schema";
import { formatActivityDate } from "../src/lib/activity-date";

describe("activity dates", () => {
  test("formats UTC dates with the full month name", () => {
    expect(formatActivityDate(new Date("2026-01-05T00:00:00Z"))).toBe("January 5, 2026");
    expect(formatActivityDate(new Date("2026-11-07T00:00:00Z"))).toBe("November 7, 2026");
  });
});

describe("activity frontmatter", () => {
  const valid = { title: "Meetup", date: "2026-11-07", tags: ["community"] };

  test("accepts required fields and parses dates", () => {
    const result = activitySchema.parse(valid);
    expect(result.date.toISOString()).toBe("2026-11-07T00:00:00.000Z");
    expect(result.tags).toEqual(["community"]);
    expect(activitySchema.safeParse({ ...valid, date: new Date("2026-11-07") }).success).toBe(true);
  });

  test("rejects missing or invalid required fields", () => {
    for (const invalid of [
      { ...valid, title: undefined },
      { ...valid, title: " " },
      { ...valid, date: undefined },
      { ...valid, date: null },
      { ...valid, date: "not a date" },
      { ...valid, tags: undefined },
      { ...valid, tags: [] },
      { ...valid, tags: [" "] },
    ]) {
      expect(activitySchema.safeParse(invalid).success).toBe(false);
    }
  });
});

describe("activity excerpts", () => {
  test("extracts the rendered Markdown before the excerpt marker", () => {
    expect(activityExcerpt("<p>A <strong>short</strong> introduction.</p>\n<!-- excerpt -->\n<p>Full content.</p>"))
      .toBe("<p>A <strong>short</strong> introduction.</p>");
  });

  test("omits missing and empty excerpts and ignores markers in code", () => {
    expect(activityExcerpt(undefined)).toBeUndefined();
    expect(activityExcerpt("<p>No marker.</p>")).toBeUndefined();
    expect(activityExcerpt("<!-- excerpt -->\n<p>Full content.</p>")).toBeUndefined();
    expect(activityExcerpt("<pre><code>&lt;!-- excerpt --&gt;</code></pre>")).toBeUndefined();
  });
});

describe("authentication destinations", () => {
  test("preserves the account, activities, and subscription destinations", () => {
    for (const destination of ["/account", "/activities", "/activities/community-meetup", "/activities/%E6%B4%BB%E5%8B%95", "/subscribe"]) {
      const path = authPath("/sign-in", destination);
      expect(authDestination(new URL(path, "https://example.com"))).toBe(destination);
      expect(authDestination(new URL(authPath("/sign-up", destination), "https://example.com"))).toBe(destination);
    }
  });

  test("rejects unrecognized and external destinations", () => {
    for (const destination of ["https://evil.example", "//evil.example", "/account?x=1", "/other", "/activities/../account", "/activities/a/b", "/activities/a?x=1", "/activities/%2F%2Fevil.example", "/activities/%zz"]) {
      const url = new URL(authPath("/sign-in", destination), "https://example.com");
      expect(authDestination(url)).toBe("/");
    }
    expect(authDestination(new URL("https://example.com/sign-in"))).toBe("/");
  });
});

describe("activity slugs", () => {
  test("derives title-based paths, including accented and non-Latin titles", () => {
    expect(activitySlug("  Café & Community Meetup! ")).toBe("cafe-community-meetup");
    expect(activityPath(activitySlug("活動"))).toBe("/activities/%E6%B4%BB%E5%8B%95");
    expect(activitiesWithSlugs([{ id: "different-file-name", data: { title: "Community Meetup" } }])[0].slug).toBe("community-meetup");
  });

  test("rejects empty and duplicate slugs", () => {
    expect(() => activitiesWithSlugs([{ id: "empty", data: { title: "!!!" } }])).toThrow("cannot produce a slug");
    expect(() => activitiesWithSlugs([
      { id: "first", data: { title: "Café Meetup" } },
      { id: "second", data: { title: "Cafe meetup!" } },
    ])).toThrow('same title slug "cafe-meetup"');
  });
});

describe("public user plans", () => {
  test("loads every page and excludes hidden and organization plans", async () => {
    const calls = [];
    const billing = {
      async getPlanList({ offset }) {
        calls.push(offset);
        const pages = [
          [{ id: "public", publiclyVisible: true, forPayerType: "user" }, { id: "hidden", publiclyVisible: false, forPayerType: "user" }],
          [{ id: "org", publiclyVisible: true, forPayerType: "org" }, { id: "another", publiclyVisible: true, forPayerType: "user" }],
        ];
        return { data: pages[offset / 2] ?? [], totalCount: 4 };
      },
    };
    const plans = await getPublicUserPlans(billing);
    expect(calls).toEqual([0, 2]);
    expect(plans.map((plan) => plan.id)).toEqual(["public", "another"]);
  });

  test("surfaces API errors and incomplete pagination", async () => {
    await expect(getPublicUserPlans({ getPlanList: async () => { throw new Error("Clerk unavailable"); } })).rejects.toThrow("Clerk unavailable");
    await expect(getPublicUserPlans({ getPlanList: async () => ({ data: [], totalCount: 1 }) })).rejects.toThrow("incomplete list");
  });
});
