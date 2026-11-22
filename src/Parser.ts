import type { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Parser {
  #tokens: Token[];

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
  }

  parse() {
    let opStack: Token[] = [];
    const output: Token[] = [];

    const Precedence = {
      [TokenType.MINUS]: 1,
      [TokenType.PLUS]: 1,
      [TokenType.STAR]: 2,
      [TokenType.SLASH]: 2,
    } as Record<TokenType, number>;

    const top = () => opStack.at(-1)!;

    const dump = (token: Token) => {
      while (
        opStack.length > 0 &&
        Precedence[top().type] > Precedence[token.type] &&
        top().type !== TokenType.LEFT_PAREN
      ) {
        output.push(opStack.pop()!);
      }
    };

    for (const token of this.#tokens) {
      switch (token.type) {
        case "RIGHT_PAREN":
          while (top().type !== TokenType.LEFT_PAREN)
            output.push(opStack.pop()!);
          opStack.pop();
          break;

        case "DURATION":
        case "NUMBER":
          output.push(token);
          break;

        case "MINUS":
        case "PLUS":
          dump(token);
        case "SLASH":
        case "STAR":
        case "LEFT_PAREN":
          opStack.push(token);
          break;

        case "EOF":
          break;
      }
    }

    while (opStack.length > 0) output.push(opStack.pop()!);

    return output;
  }
}
