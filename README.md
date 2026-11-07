# astripe

A minimal static website built with Astro and Bun.

## Getting started

Install [Bun](https://bun.sh/) and run:

```sh
bun install
bun run dev
```

Open the local URL printed by the development server.

## Commands

```sh
bun run check    # Check Astro and TypeScript files
bun run build    # Build the static site into dist/
bun run preview  # Preview the production build locally
```

## MDX

MDX is enabled through Astro's MDX integration. Add `.mdx` files to `src/pages/`
to create pages. See `src/pages/example.mdx` for a basic example using
`src/layouts/BaseLayout.astro`, available at `/example/`.