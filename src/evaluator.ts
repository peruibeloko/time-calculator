import { Token } from "./Token";
import { TokenType } from "./TokenType";

export function evaluate(rpnTokens: Token[]) {
  const stack: Token[] = [];

  
  for (const tk of rpnTokens) {
    const fns = {
      [TokenType.DURATION]: push,
      [TokenType.NUMBER]: push,
      [TokenType.PLUS]: add,
      [TokenType.MINUS]: sub,
      [TokenType.STAR]: mult,
      [TokenType.SLASH]: div,
      [TokenType.LEFT_PAREN]: () => {},
      [TokenType.RIGHT_PAREN]: () => {},
    };
    
    fns[tk.type]();
  }
}
