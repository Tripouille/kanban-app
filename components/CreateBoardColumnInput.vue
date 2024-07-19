<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Input from "./Input.vue";

type CreateBoardColumnInputEmits = {
  (e: "create-board-column", columnName: string): void;
};
const emit: CreateBoardColumnInputEmits = defineEmits();

const inputValue = ref("");
function handleCreateBoardColumn() {
  emit("create-board-column", inputValue.value);
  inputValue.value = "";
}
</script>

<template>
  <Input
    @input="inputValue = $event.target.value"
    @keyup.enter="handleCreateBoardColumn"
    :value="inputValue"
    placeholder="Create new column"
  >
    <template v-slot:icon>
      <Icon
        aria-label="create new column"
        class="h-6 w-6"
        icon="lucide:calendar-plus"
      />
    </template>
  </Input>
</template>

<style lang="scss" scoped></style>
