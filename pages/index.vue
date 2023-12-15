<script setup lang="ts">
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";

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
  <Header />
  <UMain>
    <NuxtLayout>
      <UPage>
        <UPageBody prose>
          <ULandingSection id="home" title="izmystic" description="Website Designer | Graphic Designer" :links="links" align="left">
            <img class="rounded-full" src="https://avatars.githubusercontent.com/u/72127044?v=4" />
          </ULandingSection>
        </UPageBody>

        <UPageBody prose>
          <ULandingSection id="services" title="Services"> </ULandingSection>
        </UPageBody>

        <UPageBody prose>
          <ULandingSection id="portfolio" title="Portfolio">
            <ULandingGrid>
              <ULandingCard class="col-span-6 row-span-4" title="Card Site" description="My initial developer card website"> <img src="https://github.com/izmystic/izmystic.dev/assets/72127044/738386f6-9fa2-44a1-afe6-90bce1ad1ef4" class="w-full rounded-md" /></ULandingCard>
              <ULandingCard class="col-span-6 row-span-4" title="Project #2" description="Quick description for Project #2"> <img src="https://picsum.photos/610/360" class="w-full rounded-md" /></ULandingCard>
              <ULandingCard class="col-span-6 row-span-4" title="Project #3" description="Quick description for Project #3"> <img src="https://picsum.photos/620/360" class="w-full rounded-md" /></ULandingCard>
              <ULandingCard class="col-span-6 row-span-4" title="Project #4" description="Quick description for Project #4"> <img src="https://picsum.photos/640/360" class="w-full rounded-md" /></ULandingCard>
            </ULandingGrid>
          </ULandingSection>
        </UPageBody>
      </UPage>
    </NuxtLayout>
  </UMain>
  <Footer />
</template>
