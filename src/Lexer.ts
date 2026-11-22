import { Interpreter } from "./Interpreter";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Lexer {
  #source: string;
  #start: number;
  #current: number;
  #tokens: Token[];

  constructor(input: string) {
    this.#source = input;
    this.#start = 0;
    this.#current = 0;
    this.#tokens = [];
  }

  #isAtEnd = () => this.#current >= this.#source.length;

  #advance() {
    return this.#source.charAt(this.#current++);
  }

  /** conditional advance */
  #match(expected: string) {
    if (this.#isAtEnd()) {
      Interpreter.positionError(
        this.#current,
        "Reached end of file while looking for " + expected,
      );
    }

    if (this.#source.charAt(this.#current) === expected) {
      this.#current++;
    }
  }

  #peek(n = 0) {
    if (this.#isAtEnd()) return "\0";
    return this.#source.charAt(this.#current + n);
  }

  #makeToken(type: TokenType, literal: unknown) {
    const text = this.#source.substring(this.#start, this.#current);
    return new Token(type, text, literal, this.#start);
  }

  #addToken(type: TokenType, literal: unknown) {
    this.#tokens.push(this.#makeToken(type, literal));
  }

  #addSimpleToken(type: TokenType) {
    this.#addToken(type, null);
  }

  #isDigit(c: string) {
    return /\d/.test(c);
  }

  #literal() {
    const missingUnitError = () =>
      Interpreter.positionError(this.#current, "Missing unit at duration end");

    const tooManyPartsError = () =>
      Interpreter.positionError(
        this.#current,
        "Found parts after duration end",
      );

    let offset = this.#start;
    const number = () => {
      while (this.#isDigit(this.#peek())) this.#advance();
      return Number(this.#source.substring(offset, this.#current));
    };

    let literal = number();
    let unit = this.#peek();

    if (!["d", "h", "m", "s"].includes(unit)) {
      return this.#addToken(TokenType.NUMBER, literal);
    }

    const value: Temporal.DurationLike = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    const emitToken = () => {
      this.#addToken(TokenType.DURATION, Temporal.Duration.from(value));
    };

    while (true) {
      switch (unit) {
        case "d": {
          this.#advance();
          value.days = literal;
          if (!this.#isDigit(this.#peek())) return emitToken();
          offset = this.#current;

          literal = number();
          const nextUnit = this.#peek();
          if (!["h", "m", "s"].includes(nextUnit)) return missingUnitError();
          unit = nextUnit;
          continue;
        }

        case "h": {
          this.#advance();
          value.hours = literal;
          if (!this.#isDigit(this.#peek())) return emitToken();
          offset = this.#current;

          literal = number();
          const nextUnit = this.#peek();
          if (!["m", "s"].includes(nextUnit)) return missingUnitError();
          unit = nextUnit;
          continue;
        }

        case "m": {
          this.#advance();
          this.#match("i");
          this.#match("n");
          value.minutes = literal;
          if (!this.#isDigit(this.#peek())) return emitToken();
          offset = this.#current;

          literal = number();
          const nextUnit = this.#peek();

          if (nextUnit !== "s") return missingUnitError();

          unit = nextUnit;
          continue;
        }

        case "s": {
          this.#advance();
          value.seconds = literal;
          if (this.#isDigit(this.#peek())) return tooManyPartsError();
          return emitToken();
        }

        default:
          Interpreter.positionError(
            this.#current,
            "Unexpected character during literal.",
          );
          return;
      }
    }
  }

  scanTokens() {
    while (!this.#isAtEnd()) {
      this.#start = this.#current;
      const lexeme = this.#advance();

      switch (lexeme) {
        case "(":
          this.#addSimpleToken(TokenType.LEFT_PAREN);
          break;
        case ")":
          this.#addSimpleToken(TokenType.RIGHT_PAREN);
          break;
        case "+":
          this.#addSimpleToken(TokenType.PLUS);
          break;
        case "-":
          this.#addSimpleToken(TokenType.MINUS);
          break;
        case "*":
          this.#addSimpleToken(TokenType.STAR);
          break;
        case "/":
          this.#addSimpleToken(TokenType.SLASH);
          break;

        case " ":
        case "\r":
        case "\t":
        case "\n":
          break;
        default:
          if (this.#isDigit(lexeme)) {
            this.#literal();
          } else {
            Interpreter.positionError(this.#start, "Unexpected character.");
          }
          break;
      }
    }

    this.#addSimpleToken(TokenType.EOF);
    return this.#tokens;
  }
}
