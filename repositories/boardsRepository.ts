import { produce } from "immer";
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
  createBoardColumn(boardID: BoardID, column: BoardColumn): Promise<void>;
}

let boards: Boards = v.parse(boardsSchema, [
  {
    id: "b-cd8bf8f1-ab38-4287-b540-c61b4454eae2",
    name: "house work",
    columns: [
      {
        id: "bc-87d96361-aff1-4a86-b5af-ece96ef5c5c2",
        name: "todo",
        tasks: [
          {
            id: "bt-f028b1d4-771c-4ce7-a5ad-04137d4a9d60",
            name: "Clean the house",
            description: "Use the vacum cleaner",
          },
        ],
      },
      {
        id: "bc-87d96361-aff1-4a86-b5af-ece96ef5c5c3",
        name: "in-progress",
        tasks: [
          {
            id: "bt-f028b1d4-771c-4ce7-a5ad-04137d4a9d61",
            name: "Clean the kitchen",
            description: "Use the vacum cleaner again",
          },
          {
            id: "bt-f028b1d4-771c-4ce7-a5ad-04137d4a9d65",
            name: "Clean the bathroom",
            description: "Use the vacum cleaner again and again",
          },
        ],
      },
    ],
  },
  {
    id: "b-34a6dfee-8089-41d7-b848-94c4df1ecc88",
    name: "garden work",
    columns: [
      {
        id: "bc-93808ebc-6017-4908-bfa9-ba3cde534d2e",
        name: "todo",
        tasks: [
          {
            id: "bt-bec2df98-daec-4298-ad8d-564baccf27d0",
            name: "Clean the garden",
            description: "Cut the grass",
          },
        ],
      },
    ],
  },
]);

export const InMemoryBoardsRepository: BoardsRepository = {
  async getBoards() {
    console.log("🚀 ~ getBoards ~ getBoards:", boards);
    return boards;
  },
  async createBoardColumn(boardID, column) {
    boards = produce<Boards>(boards, (draft) => {
      const board = draft.find((board) => board.id === boardID);
      if (!board) return;
      board.columns.push(column);
    });
  },
};
