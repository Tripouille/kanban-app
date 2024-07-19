<script setup lang="ts">
const route = useRoute();
const id = route.params.boardID;
</script>

<template>
  <div>boardID : {{ id }}</div>
</template>

<style lang="scss" scoped></style>
