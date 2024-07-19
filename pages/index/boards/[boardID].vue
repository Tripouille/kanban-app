<script setup lang="ts">
import { safeParse } from "valibot";
import BoardColumnComp from "~/components/BoardColumn.vue";
import CreateBoardColumnInput from "~/components/CreateBoardColumnInput.vue";
import {
  boardIDSchema,
  createBoardColumnID,
  type BoardColumn,
  type BoardID,
} from "~/repositories/boardsRepository";

const route = useRoute();
const id = route.params.boardID;
if (typeof id !== "string") {
  throw {
    statusCode: 400,
    statusMessage: "You must only provide a board ID",
    fatal: true,
  };
}

const { output: boardID, success } = safeParse(boardIDSchema, id);
if (!success) {
  throw {
    statusCode: 400,
    statusMessage: "Invalid board ID",
    fatal: true,
  };
}

const boardsStore = useBoardsStore();
const board = computed(() => boardsStore.boards.find((b) => b.id === boardID));

function handleCreateBoardColumn(boardColumnName: BoardColumn["name"]) {
  const BoardColumn: BoardColumn = {
    id: createBoardColumnID(),
    name: boardColumnName,
    tasks: [],
  };
  boardsStore.createBoardColumn(boardID as BoardID, BoardColumn);
}
</script>

<template>
  <section class="flex items-start gap-2">
    <BoardColumnComp
      v-if="board"
      v-for="column in board.columns"
      :key="column.id"
      :column="column"
      :boardID="board.id"
    />
    <CreateBoardColumnInput @create-board-column="handleCreateBoardColumn" />
  </section>
</template>
