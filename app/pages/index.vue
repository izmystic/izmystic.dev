<script setup lang="ts">
const { data: page } = await useAsyncData(() =>
    queryCollection("index").first(),
);
const [
    { data: posts },
    { data: github },
    { data: modrinth },
    { data: steam, refresh: refreshSteam },
] = await Promise.all([
    useAsyncData("recent-posts", () =>
        queryCollection("blog").order("date", "DESC").limit(5).all(),
    ),
    useFetch("/api/github"),
    useFetch("/api/modrinth"),
    useFetch("/api/steam"),
]);

let steamTimer: ReturnType<typeof setInterval> | undefined;
onMounted(() => (steamTimer = setInterval(refreshSteam, 60_000)));
onBeforeUnmount(() => clearInterval(steamTimer));

useSeoMeta({
    title: "Home",
});

const openExternal = (url: string) => window.open(url, "_blank", "noopener");
const steamStoreUrl = (appid: number) =>
    `https://store.steampowered.com/app/${appid}`;

const nav = usePanelNav(() => [
    {
        id: "about",
        count: page.value?.header.links.length ?? 0,
        open: (i) => openExternal(page.value.header.links[i].to),
    },
    {
        id: "modrinth",
        count: modrinth.value?.projects.length ?? 0,
        open: (i) => openExternal(modrinth.value.projects[i].url),
    },
    {
        id: "steam",
        count: steam.value?.top.length ?? 0,
        open: (i) => openExternal(steamStoreUrl(steam.value.top[i].appid)),
    },
    {
        id: "recent-games",
        count: steam.value?.recent.length ?? 0,
        open: (i) => openExternal(steamStoreUrl(steam.value.recent[i].appid)),
    },
    {
        id: "repos",
        count: github.value?.recentRepos.length ?? 0,
        open: (i) => openExternal(github.value.recentRepos[i].url),
    },
    {
        id: "activity",
        count: github.value?.activity.length ?? 0,
        open: (i) =>
            openExternal(`https://github.com/${github.value.activity[i].repo}`),
    },
    {
        id: "posts",
        count: posts.value?.length ?? 0,
        open: (i) => navigateTo(posts.value[i].path),
    },
]);

const swatches = [
    "bg-accent",
    "bg-yellow",
    "bg-green",
    "bg-cyan",
    "bg-magenta",
    "bg-fg",
    "bg-dim",
    "bg-line",
];

const BAR_WIDTH = 16;
const barColors = ["text-green", "text-cyan", "text-yellow", "text-magenta", "text-accent"];

function toBars<T>(items: T[], value: (item: T) => number) {
    const max = Math.max(...items.map(value), 1);
    return items.slice(0, 6).map((item, index) => {
        const filled = Math.max(1, Math.round((value(item) / max) * BAR_WIDTH));
        return {
            ...item,
            filled: "■".repeat(filled),
            empty: "■".repeat(BAR_WIDTH - filled),
            color: barColors[index % barColors.length],
        };
    });
}

const languageBars = computed(() =>
    toBars(github.value?.languages ?? [], (language) => language.count),
);
const gameBars = computed(() =>
    toBars(steam.value?.top ?? [], (game) => game.minutes),
);

const steamStateColors: Record<string, string> = {
    "in-game": "text-green",
    online: "text-cyan",
    offline: "text-dim",
};

const eventColors: Record<string, string> = {
    push: "text-green",
    star: "text-yellow",
    fork: "text-cyan",
    issue: "text-magenta",
    pr: "text-magenta",
};
</script>

<template>
    <div class="grid gap-6 lg:grid-cols-2">
        <TuiPanel
            title="about"
            :active="nav.isFocused('about')"
            class="lg:col-span-2"
        >
            <div class="flex flex-col gap-6 sm:flex-row">
                <NuxtImg
                    :src="page.header.image"
                    :alt="page.header.title"
                    width="160"
                    height="160"
                    class="size-40 shrink-0 rounded-md border border-line object-cover"
                />

                <div class="min-w-0">
                    <h1 class="font-bold text-accent">
                        {{ page.header.title }}
                    </h1>
                    <p class="text-dim" aria-hidden="true">
                        {{ "─".repeat(page.header.title.length) }}
                    </p>

                    <dl class="mt-1 grid grid-cols-[auto_1fr]">
                        <dt class="pr-4 text-accent">role</dt>
                        <dd>{{ page.header.description }}</dd>
                        <template
                            v-for="(link, index) in page.header.links"
                            :key="link.to"
                        >
                            <dt
                                class="pr-4"
                                :class="
                                    nav.isSelected('about', index)
                                        ? 'bg-cyan text-bg'
                                        : 'text-accent'
                                "
                            >
                                {{ link.label.toLowerCase() }}
                            </dt>
                            <dd
                                class="truncate"
                                :class="{
                                    'bg-cyan text-bg': nav.isSelected(
                                        'about',
                                        index,
                                    ),
                                }"
                                :data-nav-selected="
                                    nav.isSelected('about', index) || undefined
                                "
                            >
                                <a
                                    :href="link.to"
                                    target="_blank"
                                    rel="noopener"
                                    @mouseenter="nav.select('about', index)"
                                    >{{ displayUrl(link.to) }}</a
                                >
                            </dd>
                        </template>
                    </dl>

                    <div class="mt-4 flex" aria-hidden="true">
                        <span
                            v-for="swatch in swatches"
                            :key="swatch"
                            class="h-4 w-6"
                            :class="swatch"
                        />
                    </div>
                </div>
            </div>
        </TuiPanel>

        <TuiPanel title="github">
            <template v-if="github">
                <dl class="grid grid-cols-[auto_1fr] gap-x-4">
                    <dt class="text-accent">repos</dt>
                    <dd>{{ github.repos }}</dd>
                    <dt class="text-accent">stars</dt>
                    <dd>{{ github.stars }}</dd>
                    <dt class="text-accent">followers</dt>
                    <dd>{{ github.followers }}</dd>
                    <dt class="text-accent">joined</dt>
                    <dd>{{ formatDate(github.joined) }}</dd>
                </dl>

                <p class="mt-4 text-dim">languages</p>
                <ul>
                    <li
                        v-for="language in languageBars"
                        :key="language.name"
                        class="grid grid-cols-[6rem_auto_1fr] gap-x-3"
                    >
                        <span class="truncate">{{ language.name }}</span>
                        <span aria-hidden="true"
                            ><span :class="language.color">{{
                                language.filled
                            }}</span
                            ><span class="text-line">{{
                                language.empty
                            }}</span></span
                        >
                        <span class="text-dim"
                            >{{ language.count }} repos</span
                        >
                    </li>
                </ul>
            </template>
            <p v-else class="text-dim">github is unreachable right now</p>

            <template v-if="github" #footer>
                <a
                    :href="github.url"
                    target="_blank"
                    rel="noopener"
                    class="hover:text-fg"
                    >@{{ github.login }} ↗</a
                >
            </template>
        </TuiPanel>

        <TuiPanel title="modrinth" :active="nav.isFocused('modrinth')">
            <template v-if="modrinth">
                <dl class="grid grid-cols-[auto_1fr] gap-x-4">
                    <dt class="text-accent">downloads</dt>
                    <dd class="text-yellow">
                        {{ formatCount(modrinth.downloads) }}
                    </dd>
                    <dt class="text-accent">followers</dt>
                    <dd>{{ modrinth.followers }}</dd>
                    <dt class="text-accent">projects</dt>
                    <dd>{{ modrinth.projects.length }}</dd>
                </dl>

                <ul class="mt-4 grid gap-4">
                    <li
                        v-for="(project, index) in modrinth.projects"
                        :key="project.url"
                        class="flex gap-3"
                        :data-nav-selected="
                            nav.isSelected('modrinth', index) || undefined
                        "
                        @mouseenter="nav.select('modrinth', index)"
                    >
                        <NuxtImg
                            v-if="project.icon"
                            :src="project.icon"
                            :alt="project.title"
                            width="48"
                            height="48"
                            class="size-12 shrink-0 rounded-sm border border-line"
                        />
                        <div class="min-w-0">
                            <a
                                :href="project.url"
                                target="_blank"
                                rel="noopener"
                                class="px-1 font-bold"
                                :class="{
                                    'bg-cyan text-bg': nav.isSelected(
                                        'modrinth',
                                        index,
                                    ),
                                }"
                                >{{ project.title }}</a
                            >
                            <span class="text-magenta">
                                [{{ project.type }}]</span
                            >
                            <p class="text-dim">
                                {{ project.description }}
                            </p>
                            <p class="mt-1 flex flex-wrap gap-x-3">
                                <span class="text-yellow"
                                    >↓ {{ formatCount(project.downloads) }}</span
                                >
                                <span class="text-accent"
                                    >♥ {{ project.followers }}</span
                                >
                                <span class="text-green">{{
                                    project.latestVersion
                                }}</span>
                                <span class="text-dim">{{
                                    formatDate(project.updated)
                                }}</span>
                            </p>
                            <p class="text-dim">
                                {{ project.loaders.join(" ") }}
                                <template v-if="project.gameVersion">
                                    · {{ project.gameVersion }}</template
                                >
                                · {{ project.versionCount }} versions
                            </p>
                        </div>
                    </li>
                </ul>
            </template>
            <p v-else class="text-dim">modrinth is unreachable right now</p>

            <template v-if="modrinth" #footer>
                <a
                    :href="modrinth.url"
                    target="_blank"
                    rel="noopener"
                    class="hover:text-fg"
                    >{{ modrinth.username }} ↗</a
                >
            </template>
        </TuiPanel>

        <TuiPanel title="steam" :active="nav.isFocused('steam')">
            <template v-if="steam">
                <p class="flex flex-wrap gap-x-2">
                    <span
                        :class="steamStateColors[steam.state] ?? 'text-yellow'"
                        >{{ steam.state === "offline" ? "○" : "●" }}
                        {{ steam.state }}</span
                    >
                    <span v-if="steam.playing" class="font-bold">
                        {{ steam.playing.name }}</span
                    >
                    <span
                        v-else-if="steam.state === 'offline' && steam.lastOnline"
                        class="text-dim"
                    >
                        · last online {{ formatDate(steam.lastOnline) }}</span
                    >
                </p>

                <dl class="mt-3 grid grid-cols-[auto_1fr] gap-x-4">
                    <dt class="text-accent">games</dt>
                    <dd>{{ steam.gameCount }}</dd>
                    <dt class="text-accent">played</dt>
                    <dd>{{ formatPlaytime(steam.totalMinutes) }}</dd>
                    <template v-if="steam.memberSince">
                        <dt class="text-accent">since</dt>
                        <dd>{{ formatDate(steam.memberSince) }}</dd>
                    </template>
                </dl>

                <p class="mt-4 text-dim">most played</p>
                <ul>
                    <li v-for="(game, index) in gameBars" :key="game.appid">
                        <a
                            :href="steamStoreUrl(game.appid)"
                            target="_blank"
                            rel="noopener"
                            class="-mx-1 grid grid-cols-[minmax(0,14rem)_auto_1fr] gap-x-3 px-1"
                            :class="{
                                'bg-cyan text-bg': nav.isSelected('steam', index),
                            }"
                            :data-nav-selected="
                                nav.isSelected('steam', index) || undefined
                            "
                            @mouseenter="nav.select('steam', index)"
                        >
                            <span class="truncate">{{ game.name }}</span>
                            <span aria-hidden="true"
                                ><span
                                    :class="
                                        nav.isSelected('steam', index)
                                            ? ''
                                            : game.color
                                    "
                                    >{{ game.filled }}</span
                                ><span
                                    :class="
                                        nav.isSelected('steam', index)
                                            ? 'opacity-40'
                                            : 'text-line'
                                    "
                                    >{{ game.empty }}</span
                                ></span
                            >
                            <span
                                :class="
                                    nav.isSelected('steam', index)
                                        ? ''
                                        : 'text-dim'
                                "
                                >{{ formatPlaytime(game.minutes) }}</span
                            >
                        </a>
                    </li>
                </ul>
            </template>
            <p v-else class="text-dim">steam is unreachable right now</p>

            <template v-if="steam" #footer>
                <a
                    :href="steam.url"
                    target="_blank"
                    rel="noopener"
                    class="hover:text-fg"
                    >{{ steam.name }} ↗</a
                >
            </template>
        </TuiPanel>

        <TuiPanel
            v-if="steam"
            title="last 2 weeks"
            :active="nav.isFocused('recent-games')"
        >
            <div
                class="-mx-3 grid grid-cols-[1fr_6rem_6rem] gap-x-3 bg-green px-4 font-bold text-bg"
            >
                <span>GAME</span>
                <span class="text-right">2 WEEKS</span>
                <span class="text-right">TOTAL</span>
            </div>
            <ul v-if="steam.recent.length" class="-mx-3">
                <li v-for="(game, index) in steam.recent" :key="game.appid">
                    <a
                        :href="steamStoreUrl(game.appid)"
                        target="_blank"
                        rel="noopener"
                        class="grid grid-cols-[1fr_6rem_6rem] gap-x-3 px-4"
                        :class="{
                            'bg-cyan text-bg': nav.isSelected(
                                'recent-games',
                                index,
                            ),
                        }"
                        :data-nav-selected="
                            nav.isSelected('recent-games', index) || undefined
                        "
                        @mouseenter="nav.select('recent-games', index)"
                    >
                        <span class="truncate">{{ game.name }}</span>
                        <span
                            class="text-right"
                            :class="
                                nav.isSelected('recent-games', index)
                                    ? ''
                                    : 'text-yellow'
                            "
                            >{{ formatPlaytime(game.recentMinutes) }}</span
                        >
                        <span
                            class="text-right"
                            :class="
                                nav.isSelected('recent-games', index)
                                    ? ''
                                    : 'text-dim'
                            "
                            >{{ formatPlaytime(game.minutes) }}</span
                        >
                    </a>
                </li>
            </ul>
            <p v-else class="mt-2 text-dim">nothing played recently</p>
        </TuiPanel>

        <TuiPanel
            v-if="github"
            title="repos"
            :active="nav.isFocused('repos')"
        >
            <div
                class="-mx-3 grid grid-cols-[1fr_6rem_3rem] gap-x-3 bg-green px-4 font-bold text-bg sm:grid-cols-[1fr_6rem_3rem_6rem]"
            >
                <span>NAME</span>
                <span>LANG</span>
                <span class="text-right">★</span>
                <span class="hidden sm:block">PUSHED</span>
            </div>
            <ul class="-mx-3">
                <li
                    v-for="(repo, index) in github.recentRepos"
                    :key="repo.url"
                >
                    <a
                        :href="repo.url"
                        target="_blank"
                        rel="noopener"
                        :title="repo.description ?? undefined"
                        class="grid grid-cols-[1fr_6rem_3rem] gap-x-3 px-4 sm:grid-cols-[1fr_6rem_3rem_6rem]"
                        :class="{
                            'bg-cyan text-bg': nav.isSelected('repos', index),
                        }"
                        :data-nav-selected="
                            nav.isSelected('repos', index) || undefined
                        "
                        @mouseenter="nav.select('repos', index)"
                    >
                        <span class="truncate">{{ repo.name }}</span>
                        <span
                            class="truncate"
                            :class="
                                nav.isSelected('repos', index)
                                    ? ''
                                    : 'text-magenta'
                            "
                            >{{ repo.language ?? "-" }}</span
                        >
                        <span
                            class="text-right"
                            :class="
                                nav.isSelected('repos', index)
                                    ? ''
                                    : 'text-yellow'
                            "
                            >{{ repo.stars }}</span
                        >
                        <span
                            class="hidden sm:block"
                            :class="
                                nav.isSelected('repos', index)
                                    ? ''
                                    : 'text-dim'
                            "
                            >{{ formatDate(repo.pushed) }}</span
                        >
                    </a>
                </li>
            </ul>
        </TuiPanel>

        <TuiPanel
            v-if="github"
            title="activity"
            :active="nav.isFocused('activity')"
        >
            <ul>
                <li
                    v-for="(event, index) in github.activity"
                    :key="event.date + event.repo"
                >
                    <a
                        :href="`https://github.com/${event.repo}`"
                        target="_blank"
                        rel="noopener"
                        class="-mx-1 flex gap-3 px-1"
                        :class="{
                            'bg-cyan text-bg': nav.isSelected('activity', index),
                        }"
                        :data-nav-selected="
                            nav.isSelected('activity', index) || undefined
                        "
                        @mouseenter="nav.select('activity', index)"
                    >
                        <span
                            class="shrink-0"
                            :class="
                                nav.isSelected('activity', index)
                                    ? ''
                                    : 'text-dim'
                            "
                            >{{ formatDate(event.date) }}</span
                        >
                        <span
                            class="w-12 shrink-0"
                            :class="
                                nav.isSelected('activity', index)
                                    ? ''
                                    : (eventColors[event.type] ?? 'text-accent')
                            "
                            >{{ event.type }}</span
                        >
                        <span class="truncate">{{ event.repo }}</span>
                        <span
                            v-if="event.detail"
                            class="shrink-0"
                            :class="
                                nav.isSelected('activity', index)
                                    ? ''
                                    : 'text-dim'
                            "
                            >{{ event.detail }}</span
                        >
                        <span
                            v-if="event.count > 1"
                            class="shrink-0"
                            :class="
                                nav.isSelected('activity', index)
                                    ? ''
                                    : 'text-yellow'
                            "
                            >×{{ event.count }}</span
                        >
                    </a>
                </li>
            </ul>
            <p v-if="!github.activity.length" class="text-dim">
                no recent public activity
            </p>
        </TuiPanel>

        <TuiPanel
            title="recent posts"
            :active="nav.isFocused('posts')"
            class="lg:col-span-2"
        >
            <ul v-if="posts?.length">
                <li v-for="(post, index) in posts" :key="post.path">
                    <NuxtLink
                        :to="post.path"
                        class="flex gap-4 px-1"
                        :class="{
                            'bg-cyan text-bg': nav.isSelected('posts', index),
                        }"
                        :data-nav-selected="
                            nav.isSelected('posts', index) || undefined
                        "
                        @mouseenter="nav.select('posts', index)"
                    >
                        <span
                            :class="
                                nav.isSelected('posts', index)
                                    ? ''
                                    : 'text-yellow'
                            "
                            >{{ formatDate(post.date) }}</span
                        >
                        <span class="truncate">{{ post.title }}</span>
                    </NuxtLink>
                </li>
            </ul>
            <p v-else class="text-dim">no posts yet</p>

            <template #footer>
                <NuxtLink to="/blog" class="hover:text-fg"
                    >all posts →</NuxtLink
                >
            </template>
        </TuiPanel>
    </div>
</template>
