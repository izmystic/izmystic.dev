<script setup lang="ts">
import { withoutTrailingSlash, joinURL, hasProtocol } from "ufo";

const route = useRoute();

const { data: post } = await useAsyncData(route.path, () =>
    queryCollection("blog").path(route.path).first(),
);
if (!post.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
        fatal: true,
    });
}

const { data: surround } = await useAsyncData(
    `${route.path}-surround`,
    () =>
        queryCollectionItemSurroundings(
            "blog",
            withoutTrailingSlash(route.path),
        ).order("date", "DESC"),
    { default: () => [] },
);

const title = post.value.seo?.title || post.value.title;
const description = post.value.seo?.description || post.value.description;

useSeoMeta({
    title,
    ogTitle: title,
    description,
    ogDescription: description,
});

if (post.value.image?.src) {
    const site = useSiteConfig();
    const src = post.value.image.src;

    // useSeoMeta would lose to the site-wide defineOgImage in app.vue, so the post image goes through defineOgImage too
    defineOgImage(
        "Site",
        {},
        { url: hasProtocol(src) ? src : joinURL(site.url, src) },
    );
} else {
    defineOgImage("Site", { title, description });
}

const [prev, next] = [surround.value?.[0], surround.value?.[1]];
const toc = computed(() => post.value.body?.toc?.links ?? []);
const tocRows = computed(() =>
    toc.value.flatMap((link, index) => {
        const isLast = index === toc.value.length - 1;
        const children = link.children ?? [];
        return [
            { id: link.id, text: link.text, prefix: isLast ? "└─ " : "├─ " },
            ...children.map((child, childIndex) => ({
                id: child.id,
                text: child.text,
                prefix:
                    (isLast ? "   " : "│  ") +
                    (childIndex === children.length - 1 ? "└─ " : "├─ "),
            })),
        ];
    }),
);

useHotkeys([
    { keys: ["q", "Backspace"], label: "back", run: () => navigateTo("/blog") },
    {
        keys: ["h"],
        hint: "h/l",
        label: "prev/next",
        run: () => prev && navigateTo(prev.path),
    },
    { keys: ["l"], run: () => next && navigateTo(next.path) },
]);
</script>

<template>
    <div class="grid gap-6 lg:h-full lg:grid-cols-[1fr_20rem]">
        <TuiPanel :title="`${post.stem}.${post.extension}`" active>
            <article>
                <h1 class="font-bold text-accent">{{ post.title }}</h1>
                <p class="text-dim">{{ post.description }}</p>

                <p class="mt-3 flex flex-wrap gap-x-3">
                    <span class="text-yellow">{{ formatDate(post.date) }}</span>
                    <span v-if="post.badge" class="text-magenta"
                        >[{{ post.badge.label }}]</span
                    >
                    <span v-for="author in post.authors" :key="author.name">
                        <span class="text-dim">by </span>
                        <a
                            v-if="author.to"
                            :href="author.to"
                            target="_blank"
                            rel="noopener"
                            class="text-cyan hover:underline"
                            >{{ author.name }}</a
                        >
                        <span v-else>{{ author.name }}</span>
                    </span>
                </p>

                <hr class="my-4 border-line" />

                <ContentRenderer
                    v-if="post.body"
                    :value="post"
                    class="tui-prose"
                />
            </article>
        </TuiPanel>

        <aside class="grid content-start gap-6">
            <TuiPanel v-if="toc.length" title="contents">
                <ul>
                    <li v-for="row in tocRows" :key="row.id">
                        <a :href="`#${row.id}`" class="flex hover:text-cyan">
                            <span class="shrink-0 whitespace-pre text-dim">{{
                                row.prefix
                            }}</span>
                            <span>{{ row.text }}</span>
                        </a>
                    </li>
                </ul>
            </TuiPanel>

            <TuiPanel v-if="prev || next" title="more posts">
                <NuxtLink
                    v-if="prev"
                    :to="prev.path"
                    class="flex gap-2 hover:text-cyan"
                >
                    <span class="text-accent">←</span
                    ><span class="truncate">{{ prev.title }}</span>
                </NuxtLink>
                <NuxtLink
                    v-if="next"
                    :to="next.path"
                    class="flex gap-2 hover:text-cyan"
                >
                    <span class="text-accent">→</span
                    ><span class="truncate">{{ next.title }}</span>
                </NuxtLink>
            </TuiPanel>
        </aside>
    </div>
</template>
