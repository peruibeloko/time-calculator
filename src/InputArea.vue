<template>
  <textarea v-model="text"></textarea>
  <div>
    &downarrow;<button type="button" @click="emit('parse', text)">Calculate!</button>&downarrow;
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const text = ref('1d5h40min2s + 500min');
const emit = defineEmits<{
  parse: [input: string];
}>();
</script>

<style scoped>
textarea {
  padding: 1rem;
  font-size: var(--font-size__2);
  font-family: var(--font__monospace);
  background-color: var(--bg);
  color: var(--color__text);
  outline: none;
  border: 2px solid var(--color__primary);
  border-radius: 1rem;
}

button {
  border: none;
  background: none;
  font-family: var(--font__body);
  color: var(--color__text);
  border: 2px solid var(--color__primary);
  border-radius: 1rem;
  margin: 1rem 0.5rem;
  padding: 0.5rem;
  cursor: pointer;
  transition-duration: 100ms;
}

button:hover {
  background-color: var(--color__text);
  color: var(--color__background);
}
</style>
