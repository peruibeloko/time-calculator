import { Interpreter } from "./Interpreter";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lexer {
  #source: string;
  #start: number;
  #current: number;
  #tokens: Token[];

  constructor(input: string) {
    this.#source = input;
    this.#start = 0;
    this.#current = 0;
    this.#tokens = [];
  }

  #isAtEnd = () => this.#current >= this.#source.length;

  #advance() {
    return this.#source.charAt(this.#current++);
  }

  #match(expected: string) {
    if (this.#isAtEnd()) return false;
    if (this.#source.charAt(this.#current) !== expected) return false;

    this.#current++;
    return true;
  }

  #peek(n = 0) {
    if (this.#isAtEnd()) return "\0";
    return this.#source.charAt(this.#current + n);
  }

  #addSimpleToken(type: TokenType) {
    this.#addToken(type, null);
  }

  #addToken(type: TokenType, literal: unknown) {
    const text = this.#source.substring(this.#start, this.#current);
    this.#tokens.push(new Token(type, text, literal, this.#start));
  }

  #isDigit(c: string) {
    return /\d/.test(c);
  }

  #number() {
    while (this.#isDigit(this.#peek())) this.#advance();

    const value = Number(this.#source.substring(this.#start, this.#current));
    this.#addToken(TokenType.NUMBER, value);
  }

  scanTokens() {
    while (!this.#isAtEnd()) {
      this.#start = this.#current;
      const lexeme = this.#advance();

      switch (lexeme) {
        case "(":
          this.#addSimpleToken(TokenType.LEFT_PAREN);
          break;
        case ")":
          this.#addSimpleToken(TokenType.RIGHT_PAREN);
          break;
        case "+":
          this.#addSimpleToken(TokenType.PLUS);
          break;
        case "-":
          this.#addSimpleToken(TokenType.MINUS);
          break;
        case "*":
          this.#addSimpleToken(TokenType.STAR);
          break;
        case "/":
          this.#addSimpleToken(TokenType.SLASH);
          break;
        case "d":
          this.#addSimpleToken(TokenType.DAY);
          break;
        case "h":
          this.#addSimpleToken(TokenType.HOUR);
          break;
        case "s":
          this.#addSimpleToken(TokenType.SECOND);
          break;
        case "m":
          if (!this.#match("i")) { // Try for I
            Interpreter.positionError(this.#start, "Unexpected character.");
            break;
          }

          if (!this.#match("n")) { // Try for N
            Interpreter.positionError(this.#start, "Unexpected character.");
            break;
          }

          this.#addSimpleToken(TokenType.MINUTE);
          break;
        case " ":
        case "\r":
        case "\t":
        case "\n":
          break;
        default:
          if (this.#isDigit(lexeme)) {
            this.#number();
          } else {
            Interpreter.positionError(this.#start, "Unexpected character.");
          }
          break;
      }
    }

    this.#addSimpleToken(TokenType.EOF);
    return this.#tokens;
  }
}
