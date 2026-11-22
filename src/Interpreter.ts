import { Evaluator } from "./Evaluator";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import type { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Interpreter {
  run(input: string) {
    const lexer = new Lexer(input);
    const tokens = lexer.scanTokens();

    const parser = new Parser(tokens);
    const rpn = parser.parse() ?? [];

    const evaluator = new Evaluator(rpn);
    return evaluator.evaluate();
  }

  static positionError(where: number, message: string) {
    this.#report(`at position ${where}`, message);
  }

  static tokenError(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.#report(`at end`, message);
    } else {
      this.#report(
        `at '${token.lexeme}', on position ${token.position}`,
        message,
      );
    }
  }

  static #report(where: string, message: string) {
    console.error(`Error ${where}: ${message}`);
  }
}
