<script setup lang="ts">
import { themes } from "~/utils/themes";
import { mixHex } from "~/utils/color";

defineProps({
    title: { type: String, required: false, default: "title" },
    description: { type: String, required: false },
    width: { type: Number, required: false, default: 1200 },
    height: { type: Number, required: false, default: 600 },
});

const { defaultTheme } = useAppConfig();
const { bg, fg, red } = (
    themes.find((theme) => theme.id === defaultTheme) ?? themes[0]
).colors;
// The renderer doesn't support CSS color-mix(), so the muted shade from main.css is computed here
const dim = mixHex(fg, bg, 0.55);
</script>

<template>
    <div
        class="w-full h-full flex flex-col p-[48px] font-mono"
        :style="{ backgroundColor: bg, color: fg }"
    >
        <div
            class="relative flex flex-col justify-center flex-1 px-[64px] border-2 rounded-[12px]"
            :style="{ borderColor: red }"
        >
            <div
                class="absolute top-[-22px] left-[40px] flex px-[12px] text-[30px]"
                :style="{ backgroundColor: bg }"
            >
                <span :style="{ color: red }">¹</span>
                <span class="font-bold">izmystic</span>
            </div>

            <h1
                class="m-0 text-[72px] font-bold leading-tight"
                :style="{
                    color: red,
                    display: 'block',
                    lineClamp: 2,
                    textOverflow: 'ellipsis',
                }"
            >
                {{ title }}
            </h1>
            <p
                v-if="description"
                class="mt-[24px] text-[32px]"
                :style="{ color: dim }"
            >
                {{ description }}
            </p>

            <div
                class="absolute bottom-[-22px] right-[40px] flex px-[12px] text-[26px]"
                :style="{ backgroundColor: bg, color: dim }"
            >
                izmystic.dev
            </div>
        </div>
    </div>
</template>
