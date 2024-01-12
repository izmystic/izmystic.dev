<script setup lang="ts">
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "https://avatars.githubusercontent.com/u/72127044?v=4" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  ogSiteName: "izmystic",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UMain>
    <NuxtPage />
  </UMain>

  <Footer />
</template>
