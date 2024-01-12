<script setup lang="ts">
const links = [
  {
    label: "GitHub",
    color: "white",
    to: "https://github.com/izmystic",
    target: "_blank",
    icon: "i-simple-icons-github",
  },
  {
    label: "Discord",
    color: "white",
    to: "https://discord.gg/gWNKcSkCVP",
    target: "_blank",
    icon: "i-simple-icons-discord",
  },
  {
    label: "YouTube",
    color: "white",
    to: "https://www.youtube.com/@iz.Mystic",
    target: "_blank",
    icon: "i-simple-icons-youtube",
  },
];
</script>

<template>
  <ULandingSection>
    <UPageHeader id="home" title="izmystic" description="Website Designer | Graphic Designer" :links="links" align="left" class="!border-opacity-0">
      <template #icon>
        <img src="https://avatars.githubusercontent.com/u/72127044?v=4" class="w-52 h-52 object-cover rounded-full" />
      </template>
    </UPageHeader>
  </ULandingSection>
</template>
