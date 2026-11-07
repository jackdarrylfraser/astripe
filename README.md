# astripe

A minimal server-rendered website built with Astro and Bun.

## Getting started

Install [Bun](https://bun.sh/), create a [Clerk application](https://dashboard.clerk.com/),
and copy `.env.example` to `.env`. Set `PUBLIC_CLERK_PUBLISHABLE_KEY` and
`CLERK_SECRET_KEY` to the keys from the Clerk dashboard. Keep the secret key
server-side, and configure both variables in your deployment environment too.

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

## Commands

```sh
bun run check    # Check Astro and TypeScript files
bun run build    # Build the site for deployment
bun run preview  # Preview the production build locally
```

## MDX

MDX is enabled through Astro's MDX integration. Add `.mdx` files to `src/pages/`
to create pages. See `src/pages/example.mdx` for a basic example using
`src/layouts/BaseLayout.astro`, available at `/example/`.