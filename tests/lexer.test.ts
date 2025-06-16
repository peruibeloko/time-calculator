import { describe, expect, test } from 'vitest';
import { Lexer } from '../src/parser/lexer';
import * as Token from './testHelpers';

describe('Smoke tests', () => {
  test('Empty string', () => {
    expect(new Lexer('').tokenize()).toEqual([]);
  });

  test('Matches a single token', () => {
    expect(new Lexer('+').tokenize()).toEqual([Token.Plus()]);
  });

  test('Matches a few tokens', () => {
    expect(new Lexer('+++').tokenize()).toEqual([
      Token.Plus(),
      Token.Plus(),
      Token.Plus()
    ]);
  });

  test('Matches a few literal numbers', () => {
    expect(new Lexer('50 50').tokenize()).toEqual([
      Token.Number('50'),
      Token.Number('50')
    ]);
  });

  test('Matches a few literal durations', () => {
    expect(new Lexer('1d1h1min1s 1d1h1m1s').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, min: 1, s: 1 }),
      Token.Duration({ d: 1, h: 1, m: 1, s: 1 })
    ]);
  });

  test('Matches the placeholder example', () => {
    expect(new Lexer('(50min * 2) + 30min - (4 * 50s) / 2').tokenize()).toEqual(
      [
        Token.LeftParen(),
        Token.Duration({ min: 50 }),
        Token.Star(),
        Token.Number('2'),
        Token.RightParen(),
        Token.Plus(),
        Token.Duration({ min: 30 }),
        Token.Minus(),
        Token.LeftParen(),
        Token.Number('4'),
        Token.Star(),
        Token.Duration({ s: 50 }),
        Token.RightParen(),
        Token.Slash(),
        Token.Number('2')
      ]
    );
  });
});

describe('Numbers', () => {
  test('Leading zero', () => {
    expect(new Lexer('010').tokenize()).toEqual([Token.Number('010', 10)]);
  });

  test('Negatives', () => {
    expect(new Lexer('-10').tokenize()).toEqual([Token.Number('-10', -10)]);
  });

  test('Decimals', () => {
    expect(new Lexer('1.0').tokenize()).toEqual([Token.Number('1.0', 1.0)]);
  });

  test('Negative decimals', () => {
    expect(new Lexer('-1.0').tokenize()).toEqual([Token.Number('-1.0', -1.0)]);
  });
});

describe('Durations', () => {
  test('Full duration (min)', () => {
    expect(new Lexer('1d1h1min1s').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, min: 1, s: 1 })
    ]);
  });

  test('Full duration (m)', () => {
    expect(new Lexer('1d1h1m1s').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, m: 1, s: 1 })
    ]);
  });

  test('D', () => {
    expect(new Lexer('1d').tokenize()).toEqual([Token.Duration({ d: 1 })]);
  });

  test('D H', () => {
    expect(new Lexer('1d1h').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1 })
    ]);
  });

  test('D MIN', () => {
    expect(new Lexer('1d1min').tokenize()).toEqual([
      Token.Duration({ d: 1, min: 1 })
    ]);
  });

  test('D M', () => {
    expect(new Lexer('1d1m').tokenize()).toEqual([
      Token.Duration({ d: 1, m: 1 })
    ]);
  });

  test('D S', () => {
    expect(new Lexer('1d1s').tokenize()).toEqual([
      Token.Duration({ d: 1, s: 1 })
    ]);
  });

  test('D H MIN', () => {
    expect(new Lexer('1d1h1min').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, min: 1 })
    ]);
  });

  test('D H M', () => {
    expect(new Lexer('1d1h1m').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, m: 1 })
    ]);
  });

  test('D H S', () => {
    expect(new Lexer('1d1h1s').tokenize()).toEqual([
      Token.Duration({ d: 1, h: 1, s: 1 })
    ]);
  });

  test('D MIN S', () => {
    expect(new Lexer('1d1min1s').tokenize()).toEqual([
      Token.Duration({ d: 1, min: 1, s: 1 })
    ]);
  });

  test('D M S', () => {
    expect(new Lexer('1d1m1s').tokenize()).toEqual([
      Token.Duration({ d: 1, m: 1, s: 1 })
    ]);
  });

  test('H', () => {
    expect(new Lexer('1h').tokenize()).toEqual([Token.Duration({ h: 1 })]);
  });

  test('H MIN', () => {
    expect(new Lexer('1h1min').tokenize()).toEqual([
      Token.Duration({ h: 1, min: 1 })
    ]);
  });

  test('H M', () => {
    expect(new Lexer('1h1m').tokenize()).toEqual([
      Token.Duration({ h: 1, m: 1 })
    ]);
  });

  test('H S', () => {
    expect(new Lexer('1h1s').tokenize()).toEqual([
      Token.Duration({ h: 1, s: 1 })
    ]);
  });

  test('H MIN S', () => {
    expect(new Lexer('1h1min1s').tokenize()).toEqual([
      Token.Duration({ h: 1, min: 1, s: 1 })
    ]);
  });

  test('H M S', () => {
    expect(new Lexer('1h1m1s').tokenize()).toEqual([
      Token.Duration({ h: 1, m: 1, s: 1 })
    ]);
  });

  test('MIN', () => {
    expect(new Lexer('1min').tokenize()).toEqual([Token.Duration({ min: 1 })]);
  });

  test('M', () => {
    expect(new Lexer('1m').tokenize()).toEqual([Token.Duration({ m: 1 })]);
  });

  test('MIN S', () => {
    expect(new Lexer('1min1s').tokenize()).toEqual([
      Token.Duration({ min: 1, s: 1 })
    ]);
  });

  test('M S', () => {
    expect(new Lexer('1m1s').tokenize()).toEqual([
      Token.Duration({ m: 1, s: 1 })
    ]);
  });

  test('S', () => {
    expect(new Lexer('1s').tokenize()).toEqual([Token.Duration({ s: 1 })]);
  });
});

describe('Arithmetic', () => {
  test('Addition', () => {
    expect(new Lexer('1 + 1').tokenize()).toEqual([
      Token.Number('1'),
      Token.Plus(),
      Token.Number('1')
    ]);
  });

  test('Subtraction', () => {
    expect(new Lexer('1 - 1').tokenize()).toEqual([
      Token.Number('1'),
      Token.Minus(),
      Token.Number('1')
    ]);
  });

  test('Multiplication', () => {
    expect(new Lexer('1 * 1').tokenize()).toEqual([
      Token.Number('1'),
      Token.Star(),
      Token.Number('1')
    ]);
  });

  test('Division', () => {
    expect(new Lexer('1 / 1').tokenize()).toEqual([
      Token.Number('1'),
      Token.Slash(),
      Token.Number('1')
    ]);
  });

  test('Grouping', () => {
    expect(new Lexer('(1)').tokenize()).toEqual([
      Token.LeftParen(),
      Token.Number('1'),
      Token.RightParen()
    ]);
  });
});

describe('Errors', { todo: true }, () => {
  test('', () => {});
});
