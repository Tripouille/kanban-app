<script setup lang="ts">
import type { BoardID } from "~/repositories/boardsRepository";

const route = useRoute();
const isBoardActive = computed(() => (boardID: BoardID) => {
  return route.params.boardID === boardID;
});
const boardsStore = useBoardsStore();
</script>

<template>
  <nav class="flex gap-2">
    <NuxtLink
      v-for="board in boardsStore.boards"
      class="bold rounded-sm px-4 py-2 text-xl capitalize"
      :class="{
        'bg-gray-600 text-white': isBoardActive(board.id),
        'bg-white text-gray-600': !isBoardActive(board.id),
      }"
      :to="{ name: 'index-boards-boardID', params: { boardID: board.id } }"
    >
      {{ board.name }}
    </NuxtLink>
  </nav>
</template>
