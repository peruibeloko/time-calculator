import { Evaluator } from "./Evaluator";
import { Lexer } from "./Lexer";
import { Parser } from "./Parser";
import type { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Interpreter {
  static #hadError = false;

  run(input: string) {
    Interpreter.#hadError = false;
    
    const lexer = new Lexer(input);
    const tokens = lexer.scanTokens();
    console.log(tokens);

    const parser = new Parser(tokens);
    const rpn = parser.parse() ?? []; // todo still wrong somewhere, eating some tokens
    console.log(rpn);

    const evaluator = new Evaluator(rpn);
    const result = evaluator.evaluate();
    console.log(result);
  }

  static positionError(where: number, message: string) {
    this.#report(`at position ${where}`, message);
  }

  static tokenError(token: Token, message: string) {
    if (token.type === TokenType.EOF) {
      this.#report(`at end`, message);
    } else {
      this.#report(`at '${token.lexeme}', on position ${token.position}`, message);
    }
  }

  static #report(where: string, message: string) {
    console.error(`Error ${where}: ${message}`);
    Interpreter.#hadError = true;
  }
}
