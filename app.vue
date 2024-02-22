<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryContent("/").findOne());
useHead({
  meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
  link: [{ rel: "icon", href: "https://avatars.githubusercontent.com/u/72127044?v=4" }],
  htmlAttrs: {
    lang: "en",
  },
});

defineOgImageComponent("NuxtSeo", {
  title: page.value.title,
  description: page.value.description,
  theme: "#ff0000",
  colorMode: "dark",
});

useSeoMeta({
  titleTemplate: `%s - izmystic`,
  description: "Website Designer | Graphic Designer",
  ogTitle: "%s - izmystic",
  ogDescription: "Website Designer | Graphic Designer",
});
</script>

<template>
  <Header />

  <UMain>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UMain>

  <Footer />
</template>
