<script setup lang="ts">
const inputIsFocus = ref(false);
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <label
    :class="{
      'border-transparent': !inputIsFocus,
      'border-gray-400': inputIsFocus,
    }"
    class="flex h-fit flex-row items-center gap-2 rounded-sm border-2 bg-white p-4"
  >
    <slot name="icon" />
    <input
      @focus="inputIsFocus = true"
      @blur="inputIsFocus = false"
      class="outline-none"
      :="$attrs"
    />
  </label>
</template>

<style lang="scss" scoped></style>
