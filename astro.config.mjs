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
          colorPrimary: "#000000",
          colorBackground: "#ffffff",
          colorText: "#000000cc",
          colorTextSecondary: "#000000cc",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000cc",
          borderRadius: "0",
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
