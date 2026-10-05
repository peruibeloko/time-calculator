export enum TokenType {
  LEFT_PAREN = "LEFT_PAREN",
  RIGHT_PAREN = "RIGHT_PAREN",

  DAYS = "DAYS",
  HOURS = "HOURS",
  MINUTES = "MINUTES",
  SECONDS = "SECONDS",

  PLUS = "PLUS",
  MINUS = "MINUS",
  STAR = "STAR",
  SLASH = "SLASH",

  NUMBER = "NUMBER",
  DURATION = "DURATION",

  EOF = "EOF",
  ERROR = "ERROR",
}

export const Precedence = (tk: TokenType) => {
  switch (tk) {
    case TokenType.MINUS:
    case TokenType.PLUS:
      return 1;

    case TokenType.STAR:
    case TokenType.SLASH:
      return 2;

    default:
      return 0;
  }
};
