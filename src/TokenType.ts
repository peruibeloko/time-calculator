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
  ERROR: "ERROR",
});

export type TokenType = typeof TokenType[keyof typeof TokenType];