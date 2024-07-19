import { invariant } from "~/utils/invariant";
import { type BoardsRepository } from "./boardsRepository";

export type AppRepositories = {
  boardsRepository: BoardsRepository;
};

export const appRepositoriesSymbol = Symbol("appRepository");

export const useAppRepositories = (): AppRepositories => {
  const appRepositories: AppRepositories | undefined = inject(
    appRepositoriesSymbol,
  );
  invariant(appRepositories, "appRepositories must be provided");
  return appRepositories;
};
