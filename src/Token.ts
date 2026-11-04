import { TokenType } from "./TokenType";

export class Token {
  #type: TokenType;
  #lexeme: string;
  #literal: unknown;
  #position: number;

  constructor(type: TokenType, lexeme: string, literal: unknown, position: number) {
    this.#type = type;
    this.#lexeme = lexeme;
    this.#literal = literal;
    this.#position = position;
  }


  get type() {
    return this.#type;
  }

  get lexeme() {
    return this.#lexeme;
  }

  get literal() {
    return this.#literal;
  }

  get position() {
    return this.#position;
  }

  toString() {
    return `[${this.#type}:${this.#position}] ${this.#literal}`;
  }
}
