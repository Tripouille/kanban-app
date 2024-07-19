<script setup lang="ts">
import { useBoardsStore } from "~/stores/boardsStore";

const boardsStore = useBoardsStore();
boardsStore.syncBoards();
</script>

<template>
  <main class="flex flex-col gap-4 text-gray-700">
    <h1 class="text-3xl font-bold underline">
      <NuxtLink :to="{ name: 'index' }">Kanban App</NuxtLink>
    </h1>
    <section class="flex flex-col gap-2">
      <BoardNavigation />
      <NuxtPage />
    </section>
  </main>
</template>
