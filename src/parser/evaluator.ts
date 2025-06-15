import { Temporal } from '@js-temporal/polyfill';
import { Token, TokenType } from './Token';
import type { Tokens } from './Token';

export function evaluate(rpnTokens: Token[]) {
  const stack: Token[] = [];

  const isDuration = (x: Token) => x.type === TokenType.DURATION;
  const isNumber = (x: Token) => x.type === TokenType.NUMBER;
  const peek = () => stack.at(-1)!;

  const durationToken = (d: Temporal.Duration) =>
    ({
      type: TokenType.DURATION,
      lexeme: '',
      value: d
    } as Tokens.DURATION);

  const getDuration = () => {
    const a = peek();

    if (a.type !== TokenType.DURATION) return null;
    return stack.pop() as Tokens.DURATION;
  };

  const getNumber = () => {
    const a = peek();

    if (a.type !== TokenType.NUMBER) return null;
    return stack.pop() as Tokens.NUMBER;
  };

  const add = () => {
    const b = getDuration();
    const a = getDuration();

    if (!a || !b) throw new Error();

    stack.push(durationToken(a.value.add(b.value)));
  };

  const sub = () => {
    const b = getDuration();
    const a = getDuration();

    if (!a || !b) throw new Error();

    stack.push(durationToken(a.value.subtract(b.value)));
  };

  const mult = () => {
    const b = getDuration() ?? getNumber();
    const a = getDuration() ?? getNumber();

    if (!a || !b) throw new Error();
    if (a.type === b.type) throw new Error("You can't multiply two durations/numbers together");

    if (isDuration(a) && isNumber(b)) {
      let result = Temporal.Duration.from({
        seconds: a.value.total('seconds') * b.value
      });

      stack.push(durationToken(result));
    } else if (isNumber(a) && isDuration(b)) {
      let result = Temporal.Duration.from({
        seconds: b.value.total('seconds') * a.value
      });

      stack.push(durationToken(result));
    }
  };

  const div = () => {
    const b = getNumber();
    const a = getDuration();

    if (!a || !b) throw new Error();

    let result = Temporal.Duration.from({
      seconds: a.value.total('seconds') / b.value
    });

    stack.push(durationToken(result));
  };

  for (const tk of rpnTokens) {
    const push = () => stack.push(tk);

    const fns = {
      [TokenType.DURATION]: push,
      [TokenType.NUMBER]: push,
      [TokenType.PLUS]: add,
      [TokenType.MINUS]: sub,
      [TokenType.STAR]: mult,
      [TokenType.SLASH]: div,
      [TokenType.LEFT_PAREN]: () => {},
      [TokenType.RIGHT_PAREN]: () => {}
    };

    fns[tk.type]();
  }
  return (stack.pop() as Tokens.DURATION).value;
}
