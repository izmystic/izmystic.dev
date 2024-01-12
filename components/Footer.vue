<template>
  <UFooter>
    <template #left> Copyright © {{ new Date().getFullYear() }} </template>

    <template #right>
      <UColorModeSelect />
    </template>
  </UFooter>
</template>
