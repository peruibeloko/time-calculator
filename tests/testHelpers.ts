import { Temporal } from '@js-temporal/polyfill';
import { TokenType } from '../src/parser/Token';

const LiteralToken = <T>(type: TokenType, lexeme: string, value?: T) => ({
  type,
  lexeme,
  value
});

interface DurationInput {
  d?: number;
  h?: number;
  m?: number;
  min?: number;
  s?: number;
}

const LeftParen = () => LiteralToken(TokenType.LEFT_PAREN, '(');
const RightParen = () => LiteralToken(TokenType.RIGHT_PAREN, ')');
const Plus = () => LiteralToken(TokenType.PLUS, '+');
const Minus = () => LiteralToken(TokenType.MINUS, '-');
const Star = () => LiteralToken(TokenType.STAR, '*');
const Slash = () => LiteralToken(TokenType.SLASH, '/');
const Number = (ns: string, n: number = +ns) =>
  LiteralToken(TokenType.NUMBER, ns, n);
const Duration = (durIn: DurationInput) => {
  const { d, h, min, m, s } = durIn;
  return LiteralToken(
    TokenType.DURATION,
    `${d ? d + 'd' : ''}${h ? h + 'h' : ''}${min ? min + 'min' : ''}${
      m ? m + 'm' : ''
    }${s ? s + 's' : ''}`,
    Temporal.Duration.from({ days: d, hours: h, minutes: min ?? m, seconds: s })
  );
};

export { LeftParen, RightParen, Plus, Minus, Star, Slash, Number, Duration };
