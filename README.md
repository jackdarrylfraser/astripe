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

The home page uses Clerk's hosted sign-in and sign-up pages. Signed-in users can
manage their account and sign out using the user menu. Pages are public by
default; protect sensitive pages and API routes on the server using
`Astro.locals.auth()` or `context.locals.auth()` before accessing private data.
See the [Clerk Astro documentation](https://clerk.com/docs/reference/astro/overview).

## Billing and members access

1. Enable [Clerk Billing for users](https://clerk.com/docs/guides/billing/for-b2c)
   and connect a Stripe payment gateway in each Clerk environment.
2. In the Clerk Dashboard, create at least one publicly available paid **user**
   plan and add a feature with the slug `site_access` to every plan that grants
   members access. Do not add that feature to a free plan unless free access is
   intended. Configure the plan's prices in Clerk; the pricing table at
   `/pricing` displays those plans and handles checkout.
3. Use Clerk's test payment gateway and test cards to verify sign-up, checkout,
   access, cancellation, and subscription management before configuring the
   production gateway and plans.

The public home page links to pricing and the members area. After checkout, the
pricing table sends customers to `/members`. Signed-out visitors to that area
are sent to sign in and returned afterward; signed-in users without the feature
are sent to pricing. Users can manage their account and subscription through the
Clerk user menu.

The server middleware protects `/members` and all routes beneath it, checking
the **user** entitlement `site_access` on every request and disabling shared
caching. Place members-only pages or endpoints under that path, and apply an
equivalent server-side check to any sensitive data or actions exposed
elsewhere. Client-side visibility checks are not a substitute for authorization.
The members page is a placeholder for your actual subscriber content.

## Commands

```sh
bun run check    # Check Astro and TypeScript files
bun test         # Test members access checks
bun run build    # Build the site for deployment
bun run preview  # Preview the production build locally
```

## MDX

MDX is enabled through Astro's MDX integration. Add `.mdx` files to `src/pages/`
to create pages. See `src/pages/example.mdx` for a basic example using
`src/layouts/BaseLayout.astro`, available at `/example/`.