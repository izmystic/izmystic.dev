<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryContent("/").findOne());
useSeoMeta({
  title: "Home",
});
</script>

<template>
  <div>
    <ULandingSection id="home" v-bind="page.header">
      <NuxtImg :src="page.header.image" class="w-full shadow-xl object-cover rounded-full" />
    </ULandingSection>
  </div>
</template>
