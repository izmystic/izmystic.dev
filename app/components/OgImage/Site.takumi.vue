<script setup>
defineProps({
    title: { type: String, required: false, default: "title" },
    description: { type: String, required: false },
    width: { type: Number, required: false, default: 1200 },
    height: { type: Number, required: false, default: 600 },
});
</script>

<template>
    <div
        class="w-full h-full flex flex-col p-[48px] font-mono bg-[#010409] text-[#e6edf3]"
    >
        <div
            class="relative flex flex-col justify-center flex-1 px-[64px] border-2 border-[#ff7b72] rounded-[12px]"
        >
            <div
                class="absolute top-[-22px] left-[40px] flex px-[12px] bg-[#010409] text-[30px]"
            >
                <span class="text-[#ff7b72]">¹</span>
                <span class="font-bold">izmystic</span>
            </div>

            <h1
                class="m-0 text-[72px] font-bold leading-tight text-[#ff7b72]"
                style="display: block; line-clamp: 2; text-overflow: ellipsis"
            >
                {{ title }}
            </h1>
            <p v-if="description" class="mt-[24px] text-[32px] text-[#7d8590]">
                {{ description }}
            </p>

            <div
                class="absolute bottom-[-22px] right-[40px] flex px-[12px] bg-[#010409] text-[26px] text-[#7d8590]"
            >
                izmystic.dev
            </div>
        </div>
    </div>
</template>
