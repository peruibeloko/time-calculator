import { Token } from "./Token";
import { Precedence, TokenType } from "./TokenType";

export class Parser {
  #tokens: Token[];
  #current = 0;
  #opStack: Token[] = [];
  #outQueue: Token[] = [];

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
  }

  #isAtEnd() {
    return this.#current === this.#tokens.length;
  }

  #advance() {
    return this.#tokens[this.#current++];
  }

  get stackTop() {
    return this.#opStack.at(-1)!;
  }

  #popStack() {
    return this.#opStack.pop()!;
  }

  #dumpStack(currentToken: Token) {
    while (
      this.#opStack.length > 0 &&
      Precedence(this.stackTop.type) >= Precedence(currentToken.type)
    )
      this.#outQueue.push(this.#popStack());
  }

  #matchParen() {
    while (
      this.#opStack.length > 0 &&
      this.stackTop.type !== TokenType.LEFT_PAREN
    )
      this.#outQueue.push(this.#popStack());
    this.#popStack(); // Discard "("
  }

  /**
   * Combines many Number + Unit token pairs into Duration tokens
   * @param currentToken current time unit
   * @returns finalized duration token
   */
  #makeDuration(currentToken: TokenType) {
    const prev = this.#outQueue.pop();
    if (!prev) return;

    let value: Temporal.Duration;

    if (prev.type === TokenType.NUMBER) {
      const n = prev.value as number;
      switch (currentToken) {
        case TokenType.DAYS:
          value = Temporal.Duration.from({ days: n });
          break;
        case TokenType.HOURS:
          value = Temporal.Duration.from({ hours: n });
          break;
        case TokenType.MINUTES:
          value = Temporal.Duration.from({ minutes: n });
          break;
        case TokenType.SECONDS:
          value = Temporal.Duration.from({ seconds: n });
          break;
      }
    } else if (prev.type === TokenType.DURATION) {
      value = prev.value as Temporal.Duration;
    }

    this.#outQueue.push(Token(TokenType.DURATION, value!));
  }

  shuntingYard() {
    while (!this.#isAtEnd()) {
      let tk = this.#advance();      

      switch (tk.type) {
        case TokenType.RIGHT_PAREN:
          this.#matchParen();
          break;

        case TokenType.DAYS:
        case TokenType.HOURS:
        case TokenType.MINUTES:
        case TokenType.SECONDS:
          this.#makeDuration(tk.type);
          break;

        case TokenType.PLUS:
        case TokenType.MINUS:
          this.#dumpStack(tk);
        case TokenType.STAR:
        case TokenType.SLASH:
        case TokenType.LEFT_PAREN:
          this.#opStack.push(tk);
          break;

        case TokenType.NUMBER:
          this.#outQueue.push(tk);
          break;
        case TokenType.ERROR:
          break;
      }
    }

    while (this.#opStack.length > 0) {
      this.#outQueue.push(this.#popStack());
    }

    return this.#outQueue;
  }
}
