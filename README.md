# Time Calculator ⏳

Little project that showcases the new TC39 proposal for a more robust date and time global object called [Temporal](https://tc39.es/proposal-temporal/docs/). Handles basic arithmetic operations as shown in the example. Uses a RegEx based lexer and shunting yard parsing to do most of the text processing, then hands it off to Temporal for all the math work.

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
