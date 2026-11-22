# Time Calculator ⏳

Little project that showcases the new robust date and time API called [Temporal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal). Handles basic arithmetic operations as shown in the example, and uses the [shunting yard algorithm](https://en.wikipedia.org/wiki/Shunting_yard_algorithm) to parse the infix notation into RPN, which is then fed into a small evaluator that leverages Temporal for all the math work.

## Project Setup 🔧

Uses pnpm, so usual procedures follow:

```bash
pnpm i
pnpm run dev
```

And to build for production

```bash
pnpm run build
```
