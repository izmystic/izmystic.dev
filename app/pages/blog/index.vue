<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryCollection("blogPage").first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Page not found", fatal: true });
}

const { data: posts } = await useAsyncData("posts", () => queryCollection("blog").order("date", "DESC").all());

useSeoMeta({
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description,
});

defineOgImage("Site", {
  title: page.value.title,
  description: page.value.description,
});

const selected = useListNav(
  () => posts.value?.length ?? 0,
  (index) => navigateTo(posts.value[index].path),
);
</script>

<template>
  <div class="flex flex-col gap-6 lg:h-full">
    <p class="text-dim"><span class="text-accent">#</span> {{ page.description }}</p>

    <TuiPanel :title="page.title.toLowerCase()" active class="lg:min-h-0 lg:flex-1">
      <div class="-mx-3 grid grid-cols-[6rem_1fr] gap-x-4 bg-green px-4 font-bold text-bg sm:grid-cols-[6rem_8rem_1fr] md:grid-cols-[6rem_8rem_16rem_1fr]">
        <span>DATE</span>
        <span class="hidden sm:block">TAG</span>
        <span>TITLE</span>
        <span class="hidden md:block">DESCRIPTION</span>
      </div>

      <ul v-if="posts?.length" class="-mx-3">
        <li v-for="(post, index) in posts" :key="post.path">
          <NuxtLink
            :to="post.path"
            class="grid grid-cols-[6rem_1fr] gap-x-4 px-4 sm:grid-cols-[6rem_8rem_1fr] md:grid-cols-[6rem_8rem_16rem_1fr]"
            :class="selected === index ? 'bg-cyan text-bg' : ''"
            @mouseenter="selected = index"
          >
            <span :class="selected === index ? '' : 'text-yellow'">{{ formatDate(post.date) }}</span>
            <span class="hidden truncate sm:block" :class="selected === index ? '' : 'text-magenta'">{{ post.badge?.label ?? "-" }}</span>
            <span class="truncate">{{ post.title }}</span>
            <span class="hidden truncate md:block" :class="selected === index ? '' : 'text-dim'">{{ post.description }}</span>
          </NuxtLink>
        </li>
      </ul>
      <p v-else class="mt-2 text-dim">no posts yet</p>

      <template #footer>{{ posts?.length ? selected + 1 : 0 }}/{{ posts?.length ?? 0 }}</template>
    </TuiPanel>
  </div>
</template>
