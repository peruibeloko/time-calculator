import { Token, TokenPatterns } from './Token';

export class Lexer {
  #src: string;

  constructor(input: string) {
    this.#src = input;
  }

  #isAtEnd = () => this.#src.length === 0;
  #advance = (n: number) => (this.#src = this.#src.slice(n));
  #consumeWhitespace = () => (this.#src = this.#src.replace(/^\s+/, ''));

  tokenize() {
    const out: Token[] = [];

    while (!this.#isAtEnd()) {
      this.#consumeWhitespace();

      for (const [type, re] of TokenPatterns) {
        let match = this.#src.match(re)?.[0];
        if (match) {
          out.push(Token(type, match));
          this.#advance(match.length);
          break;
        }
      }
    }

    return out;
  }
}
