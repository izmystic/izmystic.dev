<script setup lang="ts">
import type { NavItem } from "@nuxt/content/dist/runtime/types";

const navigation = inject<Ref<NavItem[]>>("navigation", ref([]));

const links = [
  {
    label: "Home",
    to: "#home",
  },
  {
    label: "About",
    to: "#about",
  },
  {
    label: "Services",
    to: "#services",
  },
  {
    label: "Portfolio",
    to: "#portfolio",
  },
];
</script>

<template>
  <UHeader :links="links">
    <template #left> </template>

    <template #right>
      <UColorModeButton />
    </template>

    <template #panel>
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>
