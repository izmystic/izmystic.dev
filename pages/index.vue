<script setup lang="ts">
const { data: page } = await useAsyncData("index", () => queryContent("/").findOne());
</script>

<template>
  <div>
    <ULandingSection id="home" v-bind="page.header" >
      <img :src="page.header.image" class="w-full shadow-xl object-cover rounded-full" />
    </ULandingSection>
  </div>
</template>
