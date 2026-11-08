import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import clerk from "@clerk/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    mdx(),
    clerk({
      appearance: {
        variables: {
          colorPrimary: "#635bff",
          colorBackground: "#ffffff",
          colorText: "#17172b",
          colorTextSecondary: "#68687a",
          colorInputBackground: "#f7f7fb",
          colorInputText: "#17172b",
          borderRadius: "0.75rem",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
});
