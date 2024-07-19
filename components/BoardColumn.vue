<script setup lang="ts">
import {
  type BoardColumn,
  type BoardColumnID,
  type BoardTaskID,
} from "~/repositories/boardsRepository";

type BoardColumnProps = {
  column: BoardColumn;
};
const props = defineProps<BoardColumnProps>();
const { column } = toRefs(props);
const { moveBoardTask } = useBoardsStore();

function pickupTask(
  e: DragEvent,
  data: {
    taskID: BoardTaskID;
    columnID: BoardColumnID;
  },
) {
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("from-task-id", data.taskID);
    e.dataTransfer.setData("from-column-id", data.columnID);
  }
}

async function dropTask(
  event: DragEvent,
  data: {
    columnID: BoardColumnID;
    taskID?: BoardTaskID;
  },
) {
  if (event.dataTransfer) {
    const moveTaskParams: Omit<Parameters<typeof moveBoardTask>[0], "type"> = {
      fromColumnID: event.dataTransfer.getData(
        "from-column-id",
      ) as BoardColumnID,
      fromTaskID: event.dataTransfer.getData("from-task-id") as BoardTaskID,
      toColumnID: data.columnID,
    };

    if (/* We are dropping the task on another task */ data.taskID) {
      const targetHeight = (event.target as HTMLElement).getBoundingClientRect()
        .height;
      const { offsetY } = event;
      const dropOnTargetTopHalf = offsetY < targetHeight / 2;
      await moveBoardTask({
        ...moveTaskParams,
        type: "move-task-on-task",
        toTaskID: data.taskID,
        moveTaskBefore: dropOnTargetTopHalf,
      });
    } /* We are dropping the task on column */ else {
      await moveBoardTask({
        ...moveTaskParams,
        type: "move-to-column",
      });
    }
  }
}
</script>

<template>
  <section class="flex w-60 flex-col gap-4 rounded-sm bg-white px-6 py-4">
    <h2 class="text-xl font-extrabold uppercase">
      {{ column.name }}
    </h2>
    <ul
      @dragover.prevent
      @drop.stop="
        dropTask($event, {
          columnID: column.id,
        })
      "
      class="flex min-h-24 flex-col gap-2"
    >
      <li
        draggable="true"
        @dragover.prevent
        @dragstart="
          pickupTask($event, {
            columnID: column.id,
            taskID: task.id,
          })
        "
        @drop.stop="
          dropTask($event, {
            columnID: column.id,
            taskID: task.id,
          })
        "
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
