<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useHead({
  link: [{ rel: "icon", href: "https://avatars.githubusercontent.com/u/72127044?v=4" }],
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: "Page not found",
  description: "We are sorry but this page could not be found.",
});
</script>

<template>
  <TuiShell>
    <TuiPanel title="error" active class="mx-auto max-w-xl">
      <p class="text-accent">✗ exit code {{ error.statusCode }}</p>
      <h1 class="mt-2 font-bold">{{ error.statusMessage || error.message || "Something went wrong" }}</h1>
      <p class="mt-4 text-dim">
        press <kbd class="text-fg">1</kbd> or
        <button type="button" class="text-cyan underline underline-offset-2" @click="clearError({ redirect: '/' })">go home</button>
      </p>
    </TuiPanel>
  </TuiShell>
</template>
