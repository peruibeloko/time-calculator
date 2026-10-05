import { TokenType } from "./TokenType";

export type Token = { type: TokenType; value?: unknown };
export const Token = (type: TokenType, value?: unknown) =>
  Object.freeze({
    type,
    value,
  });
