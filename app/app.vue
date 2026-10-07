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
    description: page.value?.header.description,
    ogTitle: "%s - izmystic",
    ogDescription: page.value?.header.description,
});
</script>

<template>
    <TuiShell>
        <NuxtPage />
    </TuiShell>
</template>
