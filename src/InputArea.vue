<template>
  <textarea
    placeholder="(50min * 2) + 30min - (4 * 50s) / 2"
    v-model="text"
    @keypress.ctrl.enter="emit('parse', text)"
  ></textarea>
  <div class="controls">
    <button type="button" @click="emit('parse', text)">Calculate!</button>
    <span>or</span>
    <div><kbd>Ctrl</kbd> + <kbd>Enter</kbd></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const text = ref('');
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

.controls {
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 1rem 0;
}

button {
  border: none;
  background: none;
  font-family: var(--font__body);
  color: var(--color__text);
  border: 2px solid var(--color__primary);
  border-radius: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  transition-duration: 100ms;
}

button:hover {
  background-color: var(--color__text);
  color: var(--color__background);
}

kbd {
  background-color: var(--bg);
  border: 1px solid var(--color__primary);
  padding: 0.1rem;
  border-radius: 5px;
}
</style>
