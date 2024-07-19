import * as v from "valibot";
import { uuid } from "~/utils/uuid";

enum BoardIDsPrefix {
  BOARD = "b-",
  BOARD_COLUMN = "bc-",
  BOARD_TASK = "bt-",
}

function createID<T extends string>(prefix: BoardIDsPrefix) {
  return function () {
    return (prefix + uuid()) as T;
  };
}

export const createBoardTaskID = createID<BoardTaskID>(
  BoardIDsPrefix.BOARD_TASK,
);
export const boardTaskIDSchema = v.pipe(
  v.string(),
  v.startsWith(BoardIDsPrefix.BOARD_TASK),
  v.brand("BoardTaskID"),
);
export const boardTaskSchema = v.object({
  id: boardTaskIDSchema,
  name: v.string(),
  description: v.string(),
});
export type BoardTask = v.InferOutput<typeof boardTaskSchema>;
export type BoardTaskID = v.InferOutput<typeof boardTaskIDSchema>;

export const createBoardColumnID = createID<BoardColumnID>(
  BoardIDsPrefix.BOARD_COLUMN,
);
export const boardColumnIDSchema = v.pipe(
  v.string(),
  v.startsWith(BoardIDsPrefix.BOARD_COLUMN),
  v.brand("BoardColumnID"),
);
export const boardColumnSchema = v.object({
  id: boardColumnIDSchema,
  name: v.string(),
  tasks: v.array(boardTaskSchema),
});
export type BoardColumn = v.InferOutput<typeof boardColumnSchema>;
export type BoardColumnID = v.InferOutput<typeof boardColumnIDSchema>;

export const createBoardID = createID<BoardID>(BoardIDsPrefix.BOARD);
export const boardIDSchema = v.pipe(
  v.string(),
  v.startsWith(BoardIDsPrefix.BOARD),
  v.brand("BoardID"),
);
export const boardSchema = v.object({
  id: boardIDSchema,
  name: v.string(),
  columns: v.array(boardColumnSchema),
});

export type Board = v.InferOutput<typeof boardSchema>;
export type BoardID = v.InferOutput<typeof boardIDSchema>;

export const boardsSchema = v.array(boardSchema);
export type Boards = v.InferOutput<typeof boardsSchema>;

export interface BoardsRepository {
  getBoards(): Promise<Board[]>;
}

const boards: Boards = [];

export const InMemoryBoardsRepository: BoardsRepository = {
  async getBoards() {
    console.log("🚀 ~ getBoards ~ getBoards:", boards);
    return boards;
  },
};
