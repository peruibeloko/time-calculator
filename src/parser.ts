import { Token, type DurationType, type TimeToken } from "./Token";
import { Precedence, TokenType as Tk } from "./TokenType";

export class Parser {
  #tokens: Token[];
  #current = 0;

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
  }

  // RECURSIVE DESCENT ROCKS
}
