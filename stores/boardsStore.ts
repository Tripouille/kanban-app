import { defineStore } from "pinia";
import { useAppRepositories } from "~/repositories/appRepositories";
import type { Boards } from "~/repositories/boardsRepository";

export const useBoardsStore = defineStore("boardsStore", () => {
  const boards = ref<Boards>([]);
  const { boardsRepository } = useAppRepositories();

  async function syncBoards() {
    console.log("🚀 ~ syncBoards");
    boards.value = await boardsRepository.getBoards();
  }

  return {
    boards,
    syncBoards,
  };
});
