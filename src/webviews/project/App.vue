<template>
  <RouterView />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-color-page);
}
.t-table td:hover {
  cursor: pointer;
}
</style>