# astripe

A minimal server-rendered website built with Astro and Bun.

## Getting started

Install [Bun](https://bun.sh/), create a [Clerk application](https://dashboard.clerk.com/),
and copy `.env.example` to `.env`. Set `PUBLIC_CLERK_PUBLISHABLE_KEY` and
`CLERK_SECRET_KEY` to the keys from the Clerk dashboard. Keep the secret key
server-side, and configure both variables in your deployment environment too.
Use the publishable and secret keys from the same Clerk application and
environment. Restart the development server after changing `.env`. Explicit
keys are required; Clerk's temporary keyless development instance is not
sufficient for this site's billing and sign-in redirect flow.

Then run:

```sh
bun install
bun run dev
```

Open the local URL printed by the development server.

## Authentication

The home page links to `/sign-in` for signed-out visitors and `/activities` and
`/account` for signed-in users. New customers can create an account at `/sign-up`.
The account page uses Clerk's profile component to manage account settings, and
signed-in users can sign out from the account page. Signed-out visitors to
`/account`, `/activities`, `/tags`, an activity or tag page, or `/subscribe` are redirected to sign in and then
returned to their destination. Sign-up preserves the same destination. Only
supported destinations are accepted; other authentication redirects go to the
home page.
Protect sensitive pages and API routes on the server using `Astro.locals.auth()`
or `context.locals.auth()` before accessing private data. See the
[Clerk Astro documentation](https://clerk.com/docs/reference/astro/overview).

## Billing and members access

1. Enable [Clerk Billing for users](https://clerk.com/docs/guides/billing/for-b2c)
   and connect a Stripe payment gateway in each Clerk environment.
2. In the Clerk Dashboard, create at least one publicly available paid **user**
   plan and add a feature with the slug `site_access` to every plan that grants
   members access. Do not add that feature to a free plan unless free access is
   intended. Configure the plan's prices and a customer-facing description of
   its benefits in Clerk. `/pricing` displays public user plans, their prices,
   descriptions, and any trial. Put public feature details in the description:
   the backend plan API does not expose feature visibility, so the public
   pricing page does not list the plan's individual features. `/join` redirects
   to `/pricing`.
3. Use Clerk's test payment gateway and test cards to verify sign-up, checkout,
   access, cancellation, and subscription management before configuring the
   production gateway and plans.

Visitors continue from `/pricing` to `/sign-in` or `/sign-up` and then to
`/subscribe`. Signed-in visitors go directly to `/subscribe`, where Clerk's
pricing table displays plan features and handles plan selection and checkout.
Selecting a plan on the public page does not preselect it at checkout. After
checkout, Clerk's Continue button sends customers to `/account`, where they can
manage their account and subscription. Leaving checkout does not grant access.

The current home page is public and the middleware does not enforce a paid
entitlement. Any members-only pages or endpoints must check the **user**
entitlement `site_access` on the server before exposing sensitive data or
actions. Client-side visibility checks are not a substitute for authorization.

## Commands

```sh
bun run check    # Check Astro and TypeScript files
bun test         # Test pricing and authentication helpers
bun run build    # Build the site for deployment
bun run preview  # Preview the production build locally
```

## Activities content

The signed-in `/activities` page lists Markdown and MDX files from
`content/activities/`. Each title links to its own page at
`/activities/<title-slug>`, where the file body, date, and optional
`description` are displayed. In a Markdown (`.md`) file, put
`<!-- excerpt -->` on its own line after the introductory content to show that
content as an excerpt on the activities list. Files without the marker have no
excerpt. The entire body remains visible on the activity page.

Add an `.md` or `.mdx` file with a nonempty `title`, a valid `date`, and at
least one nonempty tag in its `tags` array in frontmatter. Slugs are generated
from titles, so titles must produce nonempty, unique slugs; changing a title
changes its URL. The `/tags` page lists the available tags, and tags link to
`/tag/<tag-slug>` to show matching activities,
newest first. Tag slugs are lowercase, omit accents, and replace punctuation
and spaces with hyphens; tags that normalize to the same slug share a page.
Each tag must contain at least one letter or number. For example:

```md
---
title: Community meetup
date: 2026-11-07
tags: [community, meetup]
---

Join members for an evening together.

<!-- excerpt -->

Meet us at the community space at 6pm.
```

MDX is enabled through Astro's MDX integration, so activity files can also
include MDX components. The activity list, tag pages, and individual pages require a signed-in user; if an activity is
for paid members only, also check the `site_access` entitlement before exposing
it, as described above.