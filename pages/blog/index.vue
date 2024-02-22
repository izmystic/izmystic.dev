<script setup lang="ts">
import type { BlogPost } from "~/types";

const { data: page } = await useAsyncData(() => queryContent("/blog").findOne());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const { data: posts } = await useAsyncData("posts", () => queryContent<BlogPost>("/blog").where({ _extension: "md" }).sort({ date: -1 }).find());

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
  <div>
    <UContainer>
      <UPageHeader v-bind="page" />

      <UPageBody>
        <UBlogList>
          <UBlogPost
            v-for="(post, index) in posts"
            :key="index"
            :to="post._path"
            :title="post.title"
            :description="post.description"
            :image="post.image"
            :date="new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
            :authors="post.authors"
            :badge="post.badge"
            :orientation="index === 0 ? 'horizontal' : 'vertical'"
            :class="[index === 0 && 'col-span-full']"
            :ui="{
              description: 'line-clamp-2',
            }"
          />
        </UBlogList>
      </UPageBody>
    </UContainer>
  </div>
</template>
