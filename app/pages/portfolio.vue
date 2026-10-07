<script setup lang="ts">
const { data: page } = await useAsyncData(() =>
    queryCollection("portfolio").first(),
);
useSeoMeta({
    title: "Portfolio",
});

const projects = computed(() => page.value?.projects ?? []);
const selected = useListNav(
    () => projects.value.length,
    (index) => window.open(projects.value[index].to, "_blank", "noopener"),
);
const project = computed(() => projects.value[selected.value]);
</script>

<template>
    <div class="flex flex-col gap-6 lg:h-full">
        <p class="text-dim">
            <span class="text-accent">#</span> {{ page.header.description }}
        </p>

        <div
            class="grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(16rem,1fr)_2fr]"
        >
            <TuiPanel title="projects" active>
                <ul>
                    <li v-for="(item, index) in projects" :key="item.to">
                        <button
                            type="button"
                            class="flex w-full gap-2 px-1 text-left"
                            :class="
                                selected === index
                                    ? 'bg-cyan text-bg'
                                    : 'hover:text-cyan'
                            "
                            @click="selected = index"
                        >
                            <span>{{ selected === index ? "▶" : " " }}</span>
                            <span class="truncate">{{ item.title }}</span>
                        </button>
                    </li>
                </ul>

                <template #footer
                    >{{ selected + 1 }}/{{ projects.length }}</template
                >
            </TuiPanel>

            <TuiPanel v-if="project" :title="project.title">
                <NuxtImg
                    :src="project.img"
                    :alt="project.title"
                    class="w-full rounded-sm border border-line"
                />
                <p class="mt-3" :class="project.description ? '' : 'text-dim'">
                    {{ project.description || "no description" }}
                </p>
                <a
                    :href="project.to"
                    target="_blank"
                    rel="noopener"
                    class="mt-2 inline-block text-cyan underline underline-offset-2"
                    >↗ {{ displayUrl(project.to) }}</a
                >
            </TuiPanel>
        </div>
    </div>
</template>
