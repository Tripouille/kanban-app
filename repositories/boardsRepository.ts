import { cloneDeep } from "lodash-es";
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

export type MoveBoardTaskToColumn = {
  type: "move-to-column";
  fromColumnID: BoardColumnID;
  fromTaskID: BoardTaskID;
  toColumnID: BoardColumnID;
};

export type MoveBoardTaskOnTask = {
  type: "move-task-on-task";
  fromColumnID: BoardColumnID;
  fromTaskID: BoardTaskID;
  toColumnID: BoardColumnID;
  toTaskID: BoardTaskID;
  moveTaskBefore: boolean;
};

export type MoveBoardTaskParams = MoveBoardTaskToColumn | MoveBoardTaskOnTask;

export interface BoardsRepository {
  getBoards(): Promise<Board[]>;
  createBoardColumn(boardID: BoardID, column: BoardColumn): Promise<void>;
  moveBoardTask(params: MoveBoardTaskParams): Promise<void>;
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
    return cloneDeep(boards);
  },
  async createBoardColumn(boardID, column) {
    boards = boards.map((board) => {
      if (board.id === boardID) {
        return {
          ...board,
          columns: [...board.columns, column],
        };
      }
      return board;
    });
  },
  async moveBoardTask(params) {
    if (
      params.type === "move-task-on-task" &&
      params.fromTaskID === params.toTaskID
    )
      return;

    function foundColumn(columnID: BoardColumnID) {
      for (const board of boards) {
        const column = board.columns.find((column) => column.id === columnID);
        if (column) return column;
      }
    }

    const { fromColumnID, toColumnID, fromTaskID } = params;

    const fromColumn = foundColumn(fromColumnID);
    if (!fromColumn) return;

    const toColumn = foundColumn(toColumnID);
    if (!toColumn) return;

    const fromTaskIndex = fromColumn.tasks.findIndex(
      (task) => task.id === fromTaskID,
    );
    if (fromTaskIndex === -1) return;

    if (params.type === "move-to-column") {
      const task = fromColumn.tasks.splice(fromTaskIndex, 1)[0];
      toColumn.tasks.push(task);
    } else if (params.type === "move-task-on-task") {
      const { toTaskID, moveTaskBefore } = params;
      const toTaskIndex = toColumn.tasks.findIndex(
        (task) => task.id === toTaskID,
      );
      if (toTaskIndex === -1) return;

      const task = fromColumn.tasks.splice(fromTaskIndex, 1)[0];
      const insertIndex = moveTaskBefore ? toTaskIndex : toTaskIndex + 1;
      toColumn.tasks.splice(insertIndex, 0, task);
    }
  },
};
