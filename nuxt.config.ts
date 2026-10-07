import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/content", "@nuxt/fonts", "@nuxt/image", "nuxt-og-image"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  site: {
    url: "https://izmystic.dev",
    name: "izmystic",
  },
  runtimeConfig: {
    githubUser: "izmystic",
    // Optional; unauthenticated GitHub requests are limited to 60/hour per IP
    githubToken: "",
    modrinthUser: "mystic",
    steamId: "76561199516407748",
    steamApiKey: "",
  },
  content: {
    experimental: { sqliteConnector: "native" },
  },
  devtools: { enabled: false },
  typescript: { strict: false },
  compatibilityDate: "2026-10-07",
});
