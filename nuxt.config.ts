export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],
  modules: ["@nuxt/content", "@nuxt/ui", "@nuxt/image", "nuxt-og-image"],
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  devtools: { enabled: false },
  typescript: { strict: false },
});
