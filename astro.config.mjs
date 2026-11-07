import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import clerk from "@clerk/astro";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [mdx(), clerk()],
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
