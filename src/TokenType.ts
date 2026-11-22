export const TokenType = Object.freeze({
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",

  PLUS: "PLUS",
  MINUS: "MINUS",
  STAR: "STAR",
  SLASH: "SLASH",

  NUMBER: "NUMBER",
  DURATION: "DURATION",
  EOF: "EOF",
});

export type TokenType = typeof TokenType[keyof typeof TokenType];
