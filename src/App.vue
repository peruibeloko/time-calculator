<template>
  <div class="container">
    <header class="centered">
      <h1 class="site-title">Time Calculator</h1>
    </header>
    <main class="main">
      <InputArea @parse="handleParse" />
      <h2 class="result">{{ result }}</h2>
    </main>
    <footer class="footer">
      <div class="line">
        <a href="https://github.com/peruibeloko/time-calculator" target="_blank" class="source-link"
          >Check the source here!</a
        >
        <span class="separator">·</span>
        <a href="https://github.com/peruibeloko" target="_blank" class="source-link"
          >Check my other projects here!</a
        >
      </div>
      <div class="line">
        <small
          >Powered by the highly experimental, bleeding-edge,
          <a href="https://tc39.es/proposal-temporal/docs/" target="_blank" class="source-link"
            >Temporal Object proposal</a
          >
        </small>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import InputArea from './InputArea.vue';

import { Lexer } from './parser/lexer';
import { Parser } from './parser/parser';
import { evaluate } from './parser/evaluator';

const result = ref('');

const handleParse = (input: string) => {
  const tokens = new Lexer(input).tokenize();
  const rpnTokens = new Parser(tokens).shuntingYard();
  const duration = evaluate(rpnTokens).round('seconds');

  let str = '';
  str += duration.days ? `${duration.days}d ` : '';
  str += duration.hours ? `${duration.hours}h ` : '';
  str += duration.minutes ? `${duration.minutes}min ` : '';
  str += duration.seconds ? `${duration.seconds}s` : '';

  result.value = str;
};
</script>

<style>
@import url('https://carlinhos.dev.br/shared/styles/theme.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  text-align: center;
  font-family: var(--font__heading);
}

#app {
  background-color: var(--color__background);
  color: var(--color__text);
  font-family: var(--font__body);
}

.container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(min-content, max-content) 1fr minmax(min-content, max-content);
  min-height: 100vh;
}

.site-title {
  padding: 3rem 0;
  font-size: 3rem;
}

main.main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

main.main textarea {
  width: 60%;
  height: 100%;
  margin: 0;
  resize: none;
}

.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 1rem;
  padding: 2rem 0;
  width: 60%;
  background-color: var(--bg);
  border: 2px solid var(--color__primary);
  border-radius: 1rem;
}

.footer {
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.line {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.source-link {
  color: var(--color__accent);
}

.separator {
  padding: 0 1rem;
  font-size: 2rem;
}

.source-link:visited {
  color: color-mix(in srgb, var(--color__accent) 100%, black 50%);
}
</style>
