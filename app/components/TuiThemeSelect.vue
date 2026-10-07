<script setup lang="ts">
const { themeId } = useTheme();
const select = useTemplateRef<HTMLSelectElement>("select");

const families = Object.entries(Object.groupBy(themes, (theme) => theme.family));

function open() {
    const el = select.value;
    if (!el) return;
    el.focus();
    try {
        el.showPicker();
    } catch {
        // showPicker is unsupported or blocked in some browsers; focus alone still allows arrow-key switching
    }
}

defineExpose({ open });
</script>

<template>
    <label class="flex items-center gap-1">
        <span class="hidden text-dim sm:inline"><span class="text-accent">t</span>heme</span>
        <select
            ref="select"
            v-model="themeId"
            aria-label="theme"
            class="max-w-32 truncate sm:max-w-40 rounded-sm border border-line bg-bg px-1 text-fg hover:border-accent"
        >
            <optgroup v-for="[family, variants] in families" :key="family" :label="family">
                <option v-for="theme in variants" :key="theme.id" :value="theme.id">
                    {{ family }} {{ theme.variant === "default" ? "" : theme.variant }}
                </option>
            </optgroup>
        </select>
    </label>
</template>
