import { Token, TokenType } from './Token';

export class Parser {
  tokens: Token[];
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  shuntingYard() {
    const opStack: Token[] = [];
    const out: Token[] = [];

    const checkNot = (tk: TokenType) => opStack.length > 0 && opStack.at(-1)!.type !== tk;

    for (const tk of this.tokens) {
      switch (tk.type) {
        case TokenType.DURATION:
        case TokenType.NUMBER:
          out.push(tk);
          continue;

        case TokenType.LEFT_PAREN:
          opStack.push(tk);
          continue;

        case TokenType.RIGHT_PAREN:
          while (checkNot(TokenType.LEFT_PAREN)) out.push(opStack.pop()!);
          opStack.pop();
          continue;

        case TokenType.PLUS:
        case TokenType.MINUS:
          while (checkNot(TokenType.LEFT_PAREN)) out.push(opStack.pop()!);
          opStack.push(tk);
          continue;

        case TokenType.STAR:
        case TokenType.SLASH:
          while (
            checkNot(TokenType.LEFT_PAREN) &&
            checkNot(TokenType.PLUS) &&
            checkNot(TokenType.MINUS)
          ) {
            out.push(opStack.pop()!);
          }
          opStack.push(tk);
          continue;
      }
    }

    while (opStack.length > 0) out.push(opStack.pop()!);
    return out;
  }
}
