<script setup lang="ts">
const route = useRoute();
const error = useError();
const hints = useHotkeyHints();
const themeSelect = useTemplateRef("themeSelect");

useThemeStyle();

const tabs = [
    { key: "1", label: "home", to: "/" },
    { key: "2", label: "portfolio", to: "/portfolio" },
    { key: "3", label: "blog", to: "/blog" },
];

function isActive(to: string) {
    return to === "/" ? route.path === "/" : route.path.startsWith(to);
}

// The error page sits outside the router view, so it has to be cleared rather than navigated away from
function go(to: string) {
    if (error.value) clearError({ redirect: to });
    else navigateTo(to);
}

function onTabClick(event: MouseEvent, to: string) {
    if (!error.value) return;
    event.preventDefault();
    go(to);
}

useHotkeys([
    ...tabs.map((tab) => ({
        keys: [tab.key],
        run: () => go(tab.to),
    })),
    { keys: ["t"], run: () => themeSelect.value?.open() },
]);

const staticHints = [
    ...tabs.map((tab) => ({ key: tab.key, label: tab.label })),
    { key: "t", label: "theme" },
];

const clock = ref("");
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
    const tick = () => (clock.value = new Date().toLocaleTimeString("en-GB"));
    tick();
    timer = setInterval(tick, 1000);
});
onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
    <div class="flex min-h-dvh flex-col lg:h-dvh">
        <header
            class="sticky top-0 z-10 flex h-9 items-center gap-3 border-b border-line bg-bg px-3"
        >
            <NuxtLink
                to="/"
                class="hidden font-bold text-accent sm:inline"
                @click="onTabClick($event, '/')"
                >izmystic</NuxtLink
            >

            <nav class="flex gap-1">
                <NuxtLink
                    v-for="tab in tabs"
                    :key="tab.to"
                    :to="tab.to"
                    class="px-1"
                    :class="
                        isActive(tab.to) && !error
                            ? 'bg-accent font-bold text-bg'
                            : 'text-dim hover:text-fg'
                    "
                    @click="onTabClick($event, tab.to)"
                >
                    <span
                        :class="
                            isActive(tab.to) && !error
                                ? 'text-bg'
                                : 'text-accent'
                        "
                        >{{ superscript(tab.key) }}</span
                    >{{ tab.label }}
                </NuxtLink>
            </nav>

            <TuiThemeSelect ref="themeSelect" class="ml-auto" />
            <span class="hidden text-dim tabular-nums sm:inline">{{
                clock
            }}</span>
        </header>

        <main class="min-h-0 flex-1 px-3 py-4 lg:overflow-auto">
            <slot />
        </main>

        <footer
            class="sticky bottom-0 flex h-7 items-center border-t border-line bg-bg px-3"
        >
            <div class="hidden gap-3 sm:flex">
                <span
                    v-for="hint in staticHints"
                    :key="hint.key"
                    class="flex"
                >
                    <kbd class="text-fg">{{ hint.key }}</kbd>
                    <span class="ml-1 bg-cyan px-1 text-bg">{{
                        hint.label
                    }}</span>
                </span>
                <span
                    v-for="hint in hints"
                    :key="hint.id + hint.key"
                    class="flex"
                >
                    <kbd class="text-fg">{{ hint.key }}</kbd>
                    <span class="ml-1 bg-cyan px-1 text-bg">{{
                        hint.label
                    }}</span>
                </span>
            </div>
            <span class="ml-auto text-dim"
                >© {{ new Date().getFullYear() }} izmystic</span
            >
        </footer>
    </div>
</template>
