import type { Token } from "./Token";
import { type DurationType, TokenType } from "./TokenType";

const isUnit = (x: Token) =>
  ([
    TokenType.DAY,
    TokenType.HOUR,
    TokenType.MINUTE,
    TokenType.SECOND,
  ] as TokenType[]).includes(x.type);
const isDuration = (x: unknown) => x instanceof Temporal.Duration;
const isNumber = (x: unknown) => typeof x === "number";

class Stack<T> {
  #state: T[] = [];

  constructor() {}

  get top() {
    return this.#state.at(-1) ?? null;
  }

  push(x: T) {
    // console.log("push ", x);
    this.#state.push(x);
  }

  pop() {
    // console.log("pop ", this.top);
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

  #advance() {
    if (this.#isAtEnd()) return null;
    return this.#tokens[this.#current++];
  }

  #peek() {
    if (this.#isAtEnd()) return null;
    return this.#tokens[this.#current];
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
    const unit = this.#advance();

    // console.log(
    //   "update duration (current, next, unit)",
    //   currentDuration,
    //   nextValue,
    //   unit,
    // );

    if (!unit) {
      // ! error
      throw Error();
    }

    if (isDuration(currentDuration)) {
      switch (unit.type) {
        case TokenType.DAY:
          this.#stack.push(
            currentDuration.add({
              days: nextValue,
            })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.HOUR:
          this.#stack.push(
            currentDuration.add({ hours: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.MINUTE:
          this.#stack.push(
            currentDuration.add({ minutes: nextValue })
              .round({
                largestUnit: "days",
                smallestUnit: "seconds",
              }),
          );
          break;
        case TokenType.SECOND:
          this.#stack.push(
            currentDuration.add({ seconds: nextValue })
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

  #handleLiteral(current: number) {
    if (isDuration(this.#stack.top)) {
      const nextToken = this.#peek();
      if (!nextToken) throw Error();

      if (isUnit(nextToken)) {
        this.#updateDuration(current);
      } else {
        this.#stack.push(current);
      }
    } else {
      this.#stack.push(current);
    }
  }

  #add() {
    const right = this.#stack.pop();
    const left = this.#stack.pop();

    // console.log("left, right", left, right);

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

    // console.log("left, right", left, right);

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

    // console.log("left, right", left, right);

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

    // console.log("left, right", left, right);

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
    while (!this.#isAtEnd()) {
      const token = this.#advance()!;

      switch (token.type) {
        case TokenType.NUMBER:
          this.#handleLiteral(token.literal as number);
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
