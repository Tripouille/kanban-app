<script setup lang="ts">
import {
  appRepositoriesSymbol,
  type AppRepositories,
} from "~/repositories/appRepositories";
import { InMemoryBoardsRepository } from "~/repositories/boardsRepository";

const appRepository: AppRepositories = {
  boardsRepository: InMemoryBoardsRepository,
};

provide(appRepositoriesSymbol, appRepository);
</script>

<template>
  <Html class="mx-auto min-h-screen max-w-7xl bg-gray-200 p-4">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </Html>
</template>
