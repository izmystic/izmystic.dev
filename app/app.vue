<script setup lang="ts">
const { data: page } = await useAsyncData(() =>
    queryCollection("index").first(),
);
useHead({
    link: [
        {
            rel: "icon",
            href: "https://avatars.githubusercontent.com/u/72127044?v=4",
        },
    ],
    htmlAttrs: {
        lang: "en",
    },
});

defineOgImage("Site", {
    title: page.value?.header.title,
    description: page.value?.header.description,
});

useSeoMeta({
    titleTemplate: `%s - izmystic`,
    description: "Website Designer | Graphic Designer",
    ogTitle: "%s - izmystic",
    ogDescription: "Website Designer | Graphic Designer",
});
</script>

<template>
    <TuiShell>
        <NuxtPage />
    </TuiShell>
</template>
