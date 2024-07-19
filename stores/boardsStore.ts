import { defineStore } from "pinia";
import { useAppRepositories } from "~/repositories/appRepositories";
import type {
  BoardColumn,
  BoardID,
  Boards,
} from "~/repositories/boardsRepository";

export const useBoardsStore = defineStore("boardsStore", () => {
  const boards = ref<Boards>([]);
  const { boardsRepository } = useAppRepositories();

  async function syncBoards() {
    console.log("🚀 ~ syncBoards");
    boards.value = await boardsRepository.getBoards();
  }

  async function createBoardColumn(boardID: BoardID, column: BoardColumn) {
    await boardsRepository.createBoardColumn(boardID, column);
    return syncBoards();
  }

  return {
    boards,
    syncBoards,
    createBoardColumn,
  };
});
