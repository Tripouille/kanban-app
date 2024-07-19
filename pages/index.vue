<script setup lang="ts">
import { useBoardsStore } from "~/stores/boardsStore";

const boardsStore = useBoardsStore();
boardsStore.syncBoards();
</script>

<template>
  <h1 class="p-2 text-3xl font-bold underline">Kanban app</h1>
  <p>{{ boardsStore.boards }}</p>
</template>
