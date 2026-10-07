<script setup lang="ts">
defineProps<{
    title: string;
    hotkey?: string | number;
    active?: boolean;
}>();
</script>

<template>
    <section
        class="relative flex min-w-0 flex-col rounded-md border"
        :class="active ? 'border-accent' : 'border-line'"
    >
        <div
            class="absolute -top-2.5 left-3 flex max-w-[calc(100%-1.5rem)] bg-bg px-1 leading-5"
        >
            <span v-if="hotkey !== undefined" class="text-accent">{{
                superscript(hotkey)
            }}</span>
            <span
                class="truncate"
                :class="active ? 'font-bold text-fg' : 'text-fg'"
                >{{ title }}</span
            >
        </div>

        <div class="min-h-0 flex-1 overflow-auto px-3 pt-4 pb-3">
            <slot />
        </div>

        <div
            v-if="$slots.footer"
            class="absolute right-3 -bottom-2.5 bg-bg px-1 leading-5 text-dim"
        >
            <slot name="footer" />
        </div>
    </section>
</template>
