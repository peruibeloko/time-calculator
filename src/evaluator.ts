import type { Token } from "./Token";
import { type DurationType, TokenType } from "./TokenType";

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
  #current: number;

  constructor(input: Token[]) {
    this.#tokens = input;
    this.#stack = new Stack();
    this.#current = 0;
  }

  #isAtEnd() {
    return this.#current >= this.#tokens.length;
  }

  #getNext() {
    if (this.#isAtEnd()) return null;
    return this.#tokens[this.#current++];
  }

  #makeDuration(unit: DurationType) {
    const currentValue = this.#stack.pop();

    if (isNumber(currentValue)) {
      switch (unit) {
        case TokenType.DAY:
          this.#stack.push(
            Temporal.Duration.from({ days: currentValue }).round({
              largestUnit: "days",
              smallestUnit: "seconds",
            }),
          );
          break;
        case TokenType.HOUR:
          this.#stack.push(
            Temporal.Duration.from({ hours: currentValue }).round({
              largestUnit: "days",
              smallestUnit: "seconds",
            }),
          );
          break;
        case TokenType.MINUTE:
          this.#stack.push(
            Temporal.Duration.from({ minutes: currentValue }).round({
              largestUnit: "days",
              smallestUnit: "seconds",
            }),
          );
          break;
        case TokenType.SECOND:
          this.#stack.push(
            Temporal.Duration.from({ seconds: currentValue }).round({
              largestUnit: "days",
              smallestUnit: "seconds",
            }),
          );
          break;
      }
    } else {
      // ! error
    }
  }

  #updateDuration(nextValue: number) {
    const currentDuration = this.#stack.pop();
    const unit = this.#getNext();

    if (!unit) {
      // ! error
      throw Error();
    }

    if (isDuration(currentDuration)) {
      switch (unit.type) {
        case TokenType.DAY:
          this.#stack.push(
            Temporal.Duration.from({ ...currentDuration, days: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.HOUR:
          this.#stack.push(
            Temporal.Duration.from({ ...currentDuration, hours: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.MINUTE:
          this.#stack.push(
            Temporal.Duration.from({ ...currentDuration, minutes: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.SECOND:
          this.#stack.push(
            Temporal.Duration.from({ ...currentDuration, seconds: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
      }
    } else {
      // ! error
      throw Error();
    }
  }

  #handleLiteral(token: Token) {
    if (this.#stack.top instanceof Temporal.Duration) {
      this.#updateDuration(token.literal as number);
    } else {
      this.#stack.push(token.literal as number);
    }
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

    if (isDuration(left) && isNumber(right)) {
      const seconds = left.total("seconds");
      this.#stack.push(
        Temporal.Duration.from({ seconds: seconds / right }).round({
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

  #mul() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    if (isDuration(left) && isNumber(right)) {
      const seconds = left.total("seconds");
      this.#stack.push(
        Temporal.Duration.from({ seconds: seconds * right }).round({
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

  evaluate() {
    while (!this.#isAtEnd()) {
      const token = this.#getNext()!;

      switch (token.type) {
        case TokenType.NUMBER:
          this.#handleLiteral(token);
          break;

        case TokenType.DAY:
        case TokenType.HOUR:
        case TokenType.MINUTE:
        case TokenType.SECOND:
          this.#makeDuration(token.type);
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

    return this.#stack.top;
  }
}
