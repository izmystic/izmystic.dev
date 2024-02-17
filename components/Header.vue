<script setup lang="ts">
const links = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/",
    exactHash: true,
  },
  {
    label: "Portfolio",
    icon: "i-heroicons-folder",
    to: "/portfolio",
    exactHash: true,
  },
  {
    label: "Blog",
    icon: "i-heroicons-newspaper",
    to: "/blog",
  },
];
</script>

<template>
  <UHeader :links="links">
    <template #left>‎</template>
    <template #panel>
      <UDashboardSidebarLinks :links="links" />
  </UHeader>
</template>
