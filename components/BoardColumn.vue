<script setup lang="ts">
import { type BoardColumn } from "~/repositories/boardsRepository";

type BoardColumnProps = {
  column: BoardColumn;
};
const props = defineProps<BoardColumnProps>();
const { column } = toRefs(props);
</script>

<template>
  <section class="flex w-60 flex-col gap-4 rounded-sm bg-white px-6 py-4">
    <h2 class="text-xl font-extrabold uppercase">
      {{ column.name }}
    </h2>
    <ul class="flex min-h-24 flex-col gap-2">
      <li
        class="flex flex-col bg-gray-300 p-2"
        v-for="task in column.tasks"
        :key="task.id"
      >
        <p class="bold text-lg">{{ task.name }}</p>
        <p class="text-sm">{{ task.description }}</p>
      </li>
    </ul>
  </section>
</template>
