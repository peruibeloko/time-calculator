import type { Token } from "./Token";
import { TokenType } from "./TokenType";

const isDuration = (x: unknown) => x instanceof Temporal.Duration;
const isNumber = (x: unknown) => typeof x === "number";

class Stack<T> {
  #state: T[] = [];

  constructor() {}

  get top() {
    return this.#state.at(-1) ?? null;
  }

  push(x: T) {
    this.#state.push(x);
  }

  pop() {
    return this.#state.pop() ?? null;
  }
}

export class Evaluator {
  #tokens: Token[];
  #stack: Stack<number | Temporal.Duration>;

  constructor(input: Token[]) {
    this.#tokens = input;
    this.#stack = new Stack();
  }

  #add() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    if (isDuration(left) && isDuration(right)) {
      this.#stack.push(
        left.add(right).round({
          largestUnit: "days",
          smallestUnit: "seconds",
        }),
      );
    } else if (isNumber(left) && isNumber(right)) {
      this.#stack.push(left + right);
    } else {
      // ! error
      throw Error();
    }
  }

  #sub() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    if (isDuration(left) && isDuration(right)) {
      this.#stack.push(
        left.subtract(right).round({
          largestUnit: "days",
          smallestUnit: "seconds",
        }),
      );
    } else if (isNumber(left) && isNumber(right)) {
      this.#stack.push(left - right);
    } else {
      // ! error
      throw Error();
    }
  }

  #div() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    if (isNumber(left) && isNumber(right)) {
      this.#stack.push(left * right);
      return;
    }

    let duration: Temporal.Duration;
    let scalar: number;

    if (isDuration(left) && isNumber(right)) {
      duration = left;
      scalar = right;
    } else if (isDuration(right) && isNumber(left)) {
      duration = right;
      scalar = left;
    } else {
      // ! error
      throw Error();
    }

    const seconds = duration.total("seconds");
    this.#stack.push(
      Temporal.Duration.from({ seconds: seconds / scalar }).round({
        largestUnit: "days",
        smallestUnit: "seconds",
      }),
    );
  }

  #mul() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    if (isNumber(left) && isNumber(right)) {
      this.#stack.push(left * right);
      return;
    }

    let duration: Temporal.Duration;
    let scalar: number;

    if (isDuration(left) && isNumber(right)) {
      duration = left;
      scalar = right;
    } else if (isDuration(right) && isNumber(left)) {
      duration = right;
      scalar = left;
    } else {
      // ! error
      throw Error();
    }

    const seconds = duration.total("seconds");
    this.#stack.push(
      Temporal.Duration.from({ seconds: seconds * scalar }).round({
        largestUnit: "days",
        smallestUnit: "seconds",
      }),
    );
  }

  evaluate() {
    for (const token of this.#tokens) {
      switch (token.type) {
        case TokenType.NUMBER:
        case TokenType.DURATION:
          this.#stack.push(token.literal as number | Temporal.Duration);
          break;

        case TokenType.PLUS:
          this.#add();
          break;
        case TokenType.MINUS:
          this.#sub();
          break;
        case TokenType.SLASH:
          this.#div();
          break;
        case TokenType.STAR:
          this.#mul();
          break;

        default:
          // ! error
          throw Error();
      }
    }

    if (this.#stack.top instanceof Temporal.Duration) {
      return this.#stack.top.round({
        largestUnit: "days",
        smallestUnit: "seconds",
      });
    }

    return this.#stack.top;
  }
}
