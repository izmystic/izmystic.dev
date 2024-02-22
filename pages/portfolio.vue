<script setup lang="ts">
const { data: page } = await useAsyncData(() => queryContent("/portfolio").findOne());
useSeoMeta({
  title: "Portfolio",
});
</script>

<template>
  <div>
    <UContainer>
      <UPageHeader v-bind="page?.header" />
      <UPageBody>
        <ULandingSection v-for="(project, index) in page?.projects" :key="index" v-bind="project" :data-aos="'fade-' + project.align" :align="project.align">
          <NuxtImg :src="project.img" class="w-full rounded-md" />
        </ULandingSection>
      </UPageBody>
    </UContainer>
  </div>
</template>
