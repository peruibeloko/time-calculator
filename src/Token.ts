import { TokenType } from "./TokenType";

export type Token = { type: TokenType; value?: unknown };
export const Token = (type: TokenType, value?: unknown) =>
  Object.freeze({
    type,
    value,
  });

export type TimeToken = {
  type:
    | TokenType.DAYS
    | TokenType.HOURS
    | TokenType.MINUTES
    | TokenType.SECONDS;
  value: number;
};
export type DurationType = TimeToken["type"];
