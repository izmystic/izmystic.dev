<script setup lang="ts">
const { data: page } = await useAsyncData("index", () => queryContent("/").findOne());
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "https://avatars.githubusercontent.com/u/72127044?v=4" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImageComponent("NuxtSeo", {
  title: page.value.title,
  description: page.value.description,
  theme: "#ff0000",
  colorMode: "dark",
});
</script>

<template>
  <Header />

  <!-- <NuxtLayout> -->
    <UMain>
      <NuxtPage />
    </UMain>
  <!-- </NuxtLayout> -->

  <Footer />
</template>
