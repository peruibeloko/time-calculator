import { Temporal } from '@js-temporal/polyfill';

export enum TokenType {
  LEFT_PAREN = 'LEFT_PAREN',
  RIGHT_PAREN = 'RIGHT_PAREN',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  STAR = 'STAR',
  SLASH = 'SLASH',
  DURATION = 'DURATION',
  NUMBER = 'NUMBER'
}

/*
! The ordering of the entries matters here!

! Because the algorithm chooses the first match regardless of size,
! we have to explicitely organize the RegExes from largest possible match 
! to smallest, due to the maximum munch rule.
*/

export const TokenPatterns = new Map([
  [
    TokenType.DURATION,
    /^(?:(?<days>\d+)d)?(?:(?<hours>\d+)h)?(?:(?<minutes>\d+)m(?:in)?)?(?:(?<seconds>\d+)s)?/i
  ],
  // We capture negative numbers in the lexer
  [TokenType.NUMBER, /^-?\d+(?:\.\d+)?/],
  [TokenType.LEFT_PAREN, /^\(/],
  [TokenType.RIGHT_PAREN, /^\)/],
  [TokenType.PLUS, /^\+/],
  [TokenType.MINUS, /^-/],
  [TokenType.STAR, /^\*/],
  [TokenType.SLASH, /^\//]
]);

export type Token =
  | { type: TokenType.LEFT_PAREN; lexeme: string }
  | { type: TokenType.RIGHT_PAREN; lexeme: string }
  | { type: TokenType.PLUS; lexeme: string }
  | { type: TokenType.MINUS; lexeme: string }
  | { type: TokenType.STAR; lexeme: string }
  | { type: TokenType.SLASH; lexeme: string }
  | { type: TokenType.DURATION; lexeme: string; value: Temporal.Duration }
  | { type: TokenType.NUMBER; lexeme: string; value: number };

export namespace Tokens {
  export type LEFT_PAREN = { type: TokenType.LEFT_PAREN; lexeme: string };
  export type RIGHT_PAREN = { type: TokenType.RIGHT_PAREN; lexeme: string };
  export type PLUS = { type: TokenType.PLUS; lexeme: string };
  export type MINUS = { type: TokenType.MINUS; lexeme: string };
  export type STAR = { type: TokenType.STAR; lexeme: string };
  export type SLASH = { type: TokenType.SLASH; lexeme: string };
  export type DURATION = {
    type: TokenType.DURATION;
    lexeme: string;
    value: Temporal.Duration;
  };
  export type NUMBER = {
    type: TokenType.NUMBER;
    lexeme: string;
    value: number;
  };
}

export function Token(type: TokenType, lexeme: string) {
  switch (type) {
    case TokenType.LEFT_PAREN:
      return { type, lexeme: '(' } as Token;
    case TokenType.RIGHT_PAREN:
      return { type, lexeme: ')' } as Token;
    case TokenType.PLUS:
      return { type, lexeme: '+' } as Token;
    case TokenType.MINUS:
      return { type, lexeme: '-' } as Token;
    case TokenType.STAR:
      return { type, lexeme: '*' } as Token;
    case TokenType.SLASH:
      return { type, lexeme: '/' } as Token;
    case TokenType.NUMBER:
      return { type, lexeme, value: Number(lexeme) } as Token;
    case TokenType.DURATION:
      const match = lexeme.match(TokenPatterns.get(TokenType.DURATION)!)!;
      const { days = 0, hours = 0, minutes = 0, seconds = 0 } = match.groups!;
      const duration = Temporal.Duration.from({
        days: +days,
        hours: +hours,
        minutes: +minutes,
        seconds: +seconds
      });
      return { type, lexeme, value: duration };
  }
}
