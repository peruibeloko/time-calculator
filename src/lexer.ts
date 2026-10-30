import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lexer {
  #src: string;
  #start: number;
  #current: number;
  #tokens: Token[];

  constructor(input: string) {
    this.#src = input;
    this.#start = 0;
    this.#current = 0;
    this.#tokens = [];
  }

  #isAtEnd = () => this.#current >= this.#src.length;

  #advance() {
    return this.#src.charAt(this.#current++);
  }

  #peek() {
    return this.#src.charAt(this.#current);
  }

  #peekNext() {
    return this.#src.charAt(this.#current + 1);
  }

  #isDigit(c: string) {
    return /\d/.test(c);
  }

  #number() {
    while (this.#isDigit(this.#peek())) this.#advance();
    return Token(
      TokenType.NUMBER,
      Number(this.#src.substring(this.#start, this.#current)),
    );
  }

  #makeToken(type: TokenType, value?: unknown) {
    if (this.#panicMode) {
      this.#tokens.push(Token(TokenType.ERROR));
      this.#panicMode = false;
    }
    this.#tokens.push(Token(type, value));
  }

  #makeUnit(type: TokenType) {
    const prev = this.#tokens.pop();
    if (prev === undefined || prev.type !== TokenType.NUMBER) {
      this.#panicMode = true;
      return;
    }

    this.#makeToken(type, prev.value);
  }

  scanTokens() {
    while (!this.#isAtEnd()) {
      this.#start = this.#current;
      const lexeme = this.#advance();

      if (this.#isDigit(lexeme)) {
        this.#tokens.push(this.#number());
        continue;
      }

      switch (lexeme) {
        case "(":
          this.#makeToken(TokenType.LEFT_PAREN);
          break;
        case ")":
          this.#makeToken(TokenType.RIGHT_PAREN);
          break;
        case "+":
          this.#makeToken(TokenType.PLUS);
          break;
        case "-":
          this.#makeToken(TokenType.MINUS);
          break;
        case "*":
          this.#makeToken(TokenType.STAR);
          break;
        case "/":
          this.#makeToken(TokenType.SLASH);
          break;
        case "d":
          this.#makeUnit(TokenType.DAYS);
          break;
        case "h":
          this.#makeUnit(TokenType.HOURS);
          break;
        case "m":
          if (this.#peek() === "i" && this.#peekNext() === "n") {
            this.#advance();
            this.#advance();
            this.#makeUnit(TokenType.MINUTES);
          } else this.#panicMode = true;
          break;
        case "s":
          this.#makeUnit(TokenType.SECONDS);
          break;
        case " ":
        case "\r":
        case "\t":
        case "\n":
          break;
        default:
          this.#panicMode = true;
      }
    }

    this.#makeToken(TokenType.EOF);
    return this.#tokens;
  }
}
