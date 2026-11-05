export const TokenType = Object.freeze({
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",

  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",

  DAY: "DAY",
  HOUR: "HOUR",
  MINUTE: "MINUTE",
  SECOND: "SECOND",

  NUMBER: "NUMBER",
  EOF: "EOF",
});

export type TokenType = typeof TokenType[keyof typeof TokenType];

export type DurationType =
  | typeof TokenType.DAY
  | typeof TokenType.HOUR
  | typeof TokenType.MINUTE
  | typeof TokenType.SECOND;
