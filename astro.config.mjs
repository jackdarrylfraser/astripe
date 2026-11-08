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
          colorPrimary: "#414141",
          colorBackground: "#ffffff",
          colorText: "#414141",
          colorTextSecondary: "#707070",
          colorInputBackground: "#ffffff",
          colorInputText: "#414141",
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
