import { Interpreter } from "./Interpreter";
import type { Token } from "./Token";
import { TokenType } from "./TokenType";

class ParseError extends Error {}

export class Parser {
  #tokens: Token[];
  #current = 0;

  constructor(tokens: Token[]) {
    this.#tokens = tokens;
  }

  #log(msg: unknown[], depth: number) {
    depth++;
    console.log("-".repeat(depth), ...msg);
  }

  #error(token: Token, message: string) {
    Interpreter.tokenError(token, message);
    return new ParseError();
  }

  #isAtEnd() {
    return this.#peek().type === TokenType.EOF;
  }

  #peek() {
    return this.#tokens[this.#current];
  }

  #previous() {
    return this.#tokens[this.#current - 1];
  }

  #advance() {
    if (!this.#isAtEnd()) this.#current++;
    return this.#previous();
  }

  #check(type: TokenType) {
    if (this.#isAtEnd()) return false;
    return this.#peek().type === type;
  }

  #match(...types: TokenType[]) {
    for (const type of types) {
      if (this.#check(type)) {
        this.#advance();
        return true;
      }
    }

    return false;
  }

  #consume(type: TokenType, message: string) {
    if (this.#check(type)) return this.#advance();
    throw this.#error(this.#peek(), message);
  }

  #expression(depth: number) {
    depth++;
    this.#log(["expression call"], depth);
    const val = this.#term(depth);
    this.#log(["expression result", val], depth);
    return val;
  }

  #term(depth: number) {
    depth++;
    this.#log(["term call"], depth);
    let expr;
    
    let left = this.#factor(depth);
    this.#log(["term left", left], depth);
    
    expr = left;
    
    while (this.#match(TokenType.MINUS, TokenType.PLUS)) {
      const op = this.#previous();
      this.#log(["term op", op], depth);
      const right = this.#factor(depth);
      this.#log(["term right", right], depth);
      expr = [...left, ...right, op];
    }

    return expr;
  }

  #factor(depth: number) {
    depth++;
    this.#log(["factor call"], depth);
    let expr;

    let left = this.#primary(depth);
    this.#log(["factor left", left], depth);
    
    expr = left;
    
    while (this.#match(TokenType.SLASH, TokenType.STAR)) {
      const op = this.#previous();
      this.#log(["factor op", op], depth);
      const right = this.#primary(depth);
      this.#log(["factor right", right], depth);
      expr = [...left, ...right, op];
    }
    
    return expr;
  }
  
  #primary(depth: number): Token[] {
    depth++;
    this.#log(["primary call"], depth);
    if (this.#match(TokenType.LEFT_PAREN)) {
      const expr = this.#expression(depth);
      this.#log(["primary expr", expr], depth);
      this.#consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.");
      return expr;
    }
    
    const num = this.#number(depth);
    this.#log(["primary num", num], depth);
    return num
  }
  
  #number(depth: number) {
    depth++;
    this.#log(["number call"], depth);
    if (this.#match(TokenType.NUMBER)) {
      const num = this.#previous();
      this.#log(["number value", num], depth);
      const day = this.#day(depth);
      this.#log(["day value", day], depth);
      return [num, ...day];
    }

    throw this.#error(this.#peek(), "Expected expression.");
  }

  #day(depth: number) {
    depth++;
    this.#log(["day call"], depth);
    let expr: Token[] = [];
    if (this.#match(TokenType.DAY)) {
      expr.push(this.#previous());
      this.#log(["day token", this.#previous()], depth);
      
      if (this.#match(TokenType.NUMBER)) {
        expr.push(this.#previous());
        expr.push(...this.#hour(depth));
      }
    } else {
      expr.push(...this.#hour(depth));
    }
    
    this.#log(["day result", expr], depth);
    return expr;
  }

  #hour(depth: number) {
    depth++;
    this.#log(["hour call"], depth);
    
    let expr: Token[] = [];
    if (this.#match(TokenType.HOUR)) {
      expr.push(this.#previous());
      this.#log(["hour token", this.#previous()], depth);
      
      if (this.#match(TokenType.NUMBER)) {
        expr.push(this.#previous());
        expr.push(...this.#minute(depth));
      }
    } else {
      expr.push(...this.#minute(depth));
    }

    this.#log(["hour result", expr], depth);
    return expr;
  }

  #minute(depth: number) {
    depth++;
    this.#log(["minute call"], depth);
    let expr: Token[] = [];
    if (this.#match(TokenType.MINUTE)) {
      expr.push(this.#previous());
      this.#log(["minute token", this.#previous()], depth);
      
      if (this.#match(TokenType.NUMBER)) {
        expr.push(this.#previous());
        expr.push(...this.#second(depth));
      }
    } else {
      expr.push(...this.#second(depth));
    }
    
    this.#log(["minute result", expr], depth);
    return expr;
  }
  
  #second(depth: number) {
    depth++;
    this.#log(["second call"], depth);
    let expr: Token[] = [];
    if (this.#match(TokenType.SECOND)) {
      expr.push(this.#previous());
      this.#log(["second token", this.#previous()], depth);
    }
    
    this.#log(["second result", expr], depth);
    return expr;
  }

  parse() {
    try {
      return this.#expression(0);
    } catch {
      return null;
    }
  }
}
