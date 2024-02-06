export default defineNuxtConfig({
  extends: ["@nuxt/ui-pro"],
  modules: ["@nuxt/content", "@nuxt/ui", "@nuxt/image", "nuxt-og-image"],
  ui: {
    icons: ["heroicons", "simple-icons"],
  },
  colorMode: {
    preference: 'dark'
  },
  devtools: { enabled: false },
  typescript: { strict: false },
});
