/**
 * ====================================================================
 * OVER-ENGINEERED SCIENTIFIC CALCULATOR ENGINE
 * ====================================================================
 * Safe expression evaluator using the Shunting-Yard algorithm.
 * NO eval(). Full operator precedence. Scientific functions.
 * Sarcastic error messages. 9+10 easter egg. Degree/Radian modes.
 */

const CalcEngine = (() => {

  // ─── Config ───────────────────────────────────────────────────────
  const MAX_EXPRESSION_LENGTH = 256;
  const UNARY_PRECEDENCE = 2.5;
  let angleMode = 'deg'; // 'deg' | 'rad'

  const setAngleMode = (mode) => { angleMode = mode; };
  const getAngleMode = () => angleMode;

  const toRad = (x) => angleMode === 'deg' ? x * Math.PI / 180 : x;

  // ─── Sarcastic Error Messages ─────────────────────────────────────
  const ERRORS = {
    DIV_ZERO:     "Bro, you just tore a hole in the spacetime continuum.",
    IMAGINARY:    "Reality.exe has stopped responding.",
    OVERFLOW:     "That's a number, not a personality trait.",
    INVALID:      "Even the calculator has no idea what you were trying to do.",
    DOMAIN:       "Nice try. The laws of mathematics remain undefeated.",
    FACTORIAL_NEG:"Factorial of negative numbers? Adorable.",
    FACTORIAL_FLOAT:"Factorials are for integers only. This isn't a jazz club.",
    FACTORIAL_BIG:"Infinity called. It said you need to calm down.",
  };

  // ─── Operator / Function Tables ───────────────────────────────────
  const OPS = {
    '+': { prec: 1, assoc: 'L', fn: (a, b) => a + b },
    '-': { prec: 1, assoc: 'L', fn: (a, b) => a - b },
    '*': { prec: 2, assoc: 'L', fn: (a, b) => a * b },
    '×': { prec: 2, assoc: 'L', fn: (a, b) => a * b },
    '/': { prec: 2, assoc: 'L', fn: (a, b) => {
      if (b === 0) throw { code: 'DIV_ZERO' };
      return a / b;
    }},
    '÷': { prec: 2, assoc: 'L', fn: (a, b) => {
      if (b === 0) throw { code: 'DIV_ZERO' };
      return a / b;
    }},
    '^': { prec: 3, assoc: 'R', fn: (a, b) => Math.pow(a, b) },
  };

  const FUNCS = {
    'sin':   (x) => Math.sin(toRad(x)),
    'cos':   (x) => Math.cos(toRad(x)),
    'tan':   (x) => {
      const r = toRad(x);
      // tan(90°), tan(270°) etc. in degree mode
      if (angleMode === 'deg' && Math.abs(x % 180) === 90) throw { code: 'DOMAIN' };
      return Math.tan(r);
    },
    'asin':  (x) => { if (Math.abs(x) > 1) throw { code: 'DOMAIN' }; return angleMode === 'deg' ? Math.asin(x) * 180 / Math.PI : Math.asin(x); },
    'acos':  (x) => { if (Math.abs(x) > 1) throw { code: 'DOMAIN' }; return angleMode === 'deg' ? Math.acos(x) * 180 / Math.PI : Math.acos(x); },
    'atan':  (x) => angleMode === 'deg' ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
    'log':   (x) => { if (x <= 0) throw { code: 'DOMAIN' }; return Math.log10(x); },
    'ln':    (x) => { if (x <= 0) throw { code: 'DOMAIN' }; return Math.log(x); },
    'sqrt':  (x) => { if (x < 0) throw { code: 'IMAGINARY' }; return Math.sqrt(x); },
    '√':     (x) => { if (x < 0) throw { code: 'IMAGINARY' }; return Math.sqrt(x); },
    'abs':   (x) => Math.abs(x),
    'ceil':  (x) => Math.ceil(x),
    'floor': (x) => Math.floor(x),
    'fact':  factorial,
  };

  const CONSTS = {
    'π': Math.PI,
    'pi': Math.PI,
    'e': Math.E,
    'Inf': Infinity,
  };

  // ─── Factorial ────────────────────────────────────────────────────
  function factorial(n) {
    if (n < 0)       throw { code: 'FACTORIAL_NEG' };
    if (!Number.isInteger(n)) throw { code: 'FACTORIAL_FLOAT' };
    if (n > 170)     throw { code: 'FACTORIAL_BIG' };
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  }

  // ─── Tokeniser ────────────────────────────────────────────────────
  // Converts the raw expression string into a flat token array.
  function tokenise(expr) {
    // Normalise
    expr = expr
      .replace(/\s+/g, '')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'π')   // keep as-is, resolved in parse
      .replace(/(\d)([a-zA-Zπ√(])/g, '$1*$2')   // implicit multiply: 2π → 2*π
      .replace(/([a-zA-Zπ√)])(\d)/g, '$1*$2');   // π2 → π*2

    const tokens = [];
    let i = 0;

    while (i < expr.length) {
      const ch = expr[i];

      // Number (including decimal)
      if (/[\d.]/.test(ch)) {
        let num = '';
        while (i < expr.length && /[\d.]/.test(expr[i])) num += expr[i++];
        // parseFloat("1.2.3") silently returns 1.2. Reject malformed
        // keyboard input instead of producing a surprisingly valid answer.
        if ((num.match(/\./g) || []).length > 1 || Number.isNaN(Number(num))) {
          throw { code: 'INVALID' };
        }
        tokens.push({ type: 'NUM', value: Number(num) });
        continue;
      }

      // Named constant or function: π, e, sin, cos, …
      if (/[a-zA-Zπ√]/.test(ch)) {
        let name = '';
        while (i < expr.length && /[a-zA-Zπ√]/.test(expr[i])) name += expr[i++];
        if (Object.prototype.hasOwnProperty.call(CONSTS, name)) {
          tokens.push({ type: 'NUM', value: CONSTS[name] });
        } else if (Object.prototype.hasOwnProperty.call(FUNCS, name)) {
          tokens.push({ type: 'FUNC', value: name });
        } else {
          throw { code: 'INVALID' };
        }
        continue;
      }

      // Postfix operators. Percentage follows calculator convention:
      // 50% becomes 0.5 rather than a binary modulo operation.
      if (ch === '!') {
        tokens.push({ type: 'POSTFIX', value: 'fact' });
        i++;
        continue;
      }
      if (ch === '%') {
        tokens.push({ type: 'POSTFIX', value: 'percent' });
        i++;
        continue;
      }

      // Operators
      if (ch in OPS) {
        // Handle unary minus/plus
        const isUnary = tokens.length === 0 ||
          tokens[tokens.length - 1].type === 'OP' ||
          tokens[tokens.length - 1].type === 'LPAREN' ||
          tokens[tokens.length - 1].type === 'FUNC';

        if (isUnary && ch === '-') {
          tokens.push({ type: 'UNARY_MINUS' });
        } else if (isUnary && ch === '+') {
          // skip unary plus
        } else {
          tokens.push({ type: 'OP', value: ch });
        }
        i++;
        continue;
      }

      if (ch === '(') { tokens.push({ type: 'LPAREN' }); i++; continue; }
      if (ch === ')') { tokens.push({ type: 'RPAREN' }); i++; continue; }
      if (ch === ',') { i++; continue; } // argument separator

      // Unknown character
      throw { code: 'INVALID' };
    }

    return tokens;
  }

  // ─── Shunting-Yard → RPN ─────────────────────────────────────────
  function toRPN(tokens) {
    const output = [];
    const ops = [];

    for (const tok of tokens) {
      if (tok.type === 'NUM') {
        output.push(tok);
      } else if (tok.type === 'FUNC') {
        ops.push(tok);
      } else if (tok.type === 'UNARY_MINUS') {
        // Push as high-precedence right-associative pseudo-op
        ops.push({ type: 'UNARY_MINUS' });
      } else if (tok.type === 'POSTFIX') {
        output.push(tok);
      } else if (tok.type === 'OP') {
        const o1 = OPS[tok.value];
        while (ops.length > 0) {
          const top = ops[ops.length - 1];
          if (top.type === 'LPAREN') break;
          if (top.type === 'UNARY_MINUS') {
            if (o1.prec > UNARY_PRECEDENCE) break;
            output.push(ops.pop());
            continue;
          }
          if (top.type === 'FUNC') {
            output.push(ops.pop());
            continue;
          }
          const o2 = OPS[top.value];
          if (o2 && (o2.prec > o1.prec || (o2.prec === o1.prec && o1.assoc === 'L'))) {
            output.push(ops.pop());
          } else break;
        }
        ops.push(tok);
      } else if (tok.type === 'LPAREN') {
        ops.push(tok);
      } else if (tok.type === 'RPAREN') {
        while (ops.length > 0 && ops[ops.length - 1].type !== 'LPAREN') {
          output.push(ops.pop());
        }
        if (ops.length === 0) throw { code: 'INVALID' }; // mismatched parens
        ops.pop(); // discard LPAREN
        if (ops.length > 0 && ops[ops.length - 1].type === 'FUNC') {
          output.push(ops.pop());
        }
      }
    }

    while (ops.length > 0) {
      const top = ops.pop();
      if (top.type === 'LPAREN') throw { code: 'INVALID' };
      output.push(top);
    }

    return output;
  }

  // ─── RPN Evaluator ────────────────────────────────────────────────
  function evalRPN(rpn) {
    const stack = [];

    for (const tok of rpn) {
      if (tok.type === 'NUM') {
        stack.push(tok.value);
      } else if (tok.type === 'UNARY_MINUS') {
        if (stack.length < 1) throw { code: 'INVALID' };
        stack.push(-stack.pop());
      } else if (tok.type === 'POSTFIX') {
        if (stack.length < 1) throw { code: 'INVALID' };
        const a = stack.pop();
        stack.push(tok.value === 'percent' ? a / 100 : FUNCS[tok.value](a));
      } else if (tok.type === 'FUNC') {
        if (stack.length < 1) throw { code: 'INVALID' };
        const a = stack.pop();
        stack.push(FUNCS[tok.value](a));
      } else if (tok.type === 'OP') {
        if (stack.length < 2) throw { code: 'INVALID' };
        const b = stack.pop();
        const a = stack.pop();
        stack.push(OPS[tok.value].fn(a, b));
      }
    }

    if (stack.length !== 1) throw { code: 'INVALID' };
    return stack[0];
  }

  // ─── Format Output ────────────────────────────────────────────────
  function formatResult(value) {
    if (!isFinite(value)) {
      if (value === Infinity || value === -Infinity) throw { code: 'OVERFLOW' };
      throw { code: 'INVALID' };
    }
    // Trim floating-point noise: 0.1 + 0.2 → 0.3, not 0.30000000000000004
    const rounded = parseFloat(value.toPrecision(12));
    // If integer, show without decimal
    if (Number.isInteger(rounded)) return String(rounded);
    return String(rounded);
  }

  // ─── Public evaluate() ────────────────────────────────────────────
  function evaluate(rawExpr) {
    if (typeof rawExpr !== 'string') {
      return { value: null, error: 'INVALID', errorMessage: ERRORS.INVALID };
    }
    if (rawExpr.length > MAX_EXPRESSION_LENGTH) {
      return { value: null, error: 'OVERFLOW', errorMessage: 'Expression exceeds the 256-character safety limit.' };
    }

    // ── 9 + 10 Easter Egg ──────────────────────────────────────────
    const normalised = rawExpr.replace(/\s/g, '');
    if (normalised === '9+10' || normalised === '10+9') {
      return { value: '19', displayValue: '19', isEasterEgg: true, eggMessage: 'Nice try. The meme says 21; mathematics says 19.' };
    }

    try {
      const tokens = tokenise(rawExpr);
      const rpn    = toRPN(tokens);
      const raw    = evalRPN(rpn);
      const value  = formatResult(raw);
      return { value, displayValue: value, isEasterEgg: false };
    } catch (err) {
      const code = err && err.code ? err.code : 'INVALID';
      const message = ERRORS[code] || ERRORS.INVALID;
      return { value: null, error: code, errorMessage: message };
    }
  }

  // ─── Public API ───────────────────────────────────────────────────
  return { evaluate, setAngleMode, getAngleMode, ERRORS };

})();
