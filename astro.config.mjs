import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [mdx()],
  vite: {
    ssr: {
      external: ["resend"],
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
