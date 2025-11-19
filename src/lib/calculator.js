const SAFE_EXPRESSION = /^[0-9+\-*/^().\s]+$/;
const MAX_HISTORY = 50;

const OPERATOR_CONFIG = {
  '+': { precedence: 1, associativity: 'left', operands: 2, fn: (a, b) => a + b },
  '-': { precedence: 1, associativity: 'left', operands: 2, fn: (a, b) => a - b },
  '*': { precedence: 2, associativity: 'left', operands: 2, fn: (a, b) => a * b },
  '/': {
    precedence: 2,
    associativity: 'left',
    operands: 2,
    fn: (a, b) => {
      if (b === 0) {
        throw new Error('Cannot divide by zero');
      }
      return a / b;
    }
  },
  '^': { precedence: 3, associativity: 'right', operands: 2, fn: (a, b) => Math.pow(a, b) },
  'u-': { precedence: 4, associativity: 'right', operands: 1, fn: (value) => -value },
  'u+': { precedence: 4, associativity: 'right', operands: 1, fn: (value) => value }
};

export class MemoryRegister {
  #value = 0;

  clear() {
    this.#value = 0;
  }

  recall() {
    return this.#value;
  }

  add(amount) {
    const normalised = normaliseNumber(amount);
    this.#value = Number.isNaN(normalised) ? this.#value : this.#value + normalised;
    return this.#value;
  }

  subtract(amount) {
    const normalised = normaliseNumber(amount);
    this.#value = Number.isNaN(normalised) ? this.#value : this.#value - normalised;
    return this.#value;
  }
}

export function sanitizeExpression(expression) {
  if (typeof expression !== 'string') {
    throw new TypeError('Expression must be a string');
  }

  const trimmed = expression.trim();
  if (trimmed === '') {
    return '';
  }

  if (!SAFE_EXPRESSION.test(trimmed)) {
    throw new Error('Unsupported characters in expression');
  }

  return trimmed.replace(/\s+/g, '');
}

export function evaluateExpression(rawExpression) {
  const expression = sanitizeExpression(rawExpression);
  if (!expression) {
    throw new Error('Expression is empty');
  }

  const tokens = tokenize(expression);
  const rpn = toReversePolish(tokens);
  const result = evaluateReversePolish(rpn);

  if (!Number.isFinite(result)) {
    throw new Error('Result is not a finite number');
  }

  return normaliseNumber(result);
}

export function evaluateSquareRoot(rawExpression) {
  const value = evaluateExpression(rawExpression);
  if (value < 0) {
    throw new Error('Cannot take the square root of a negative number');
  }
  return normaliseNumber(Math.sqrt(value));
}

export function evaluatePercentage(rawExpression) {
  const value = evaluateExpression(rawExpression);
  return normaliseNumber(value / 100);
}

export function formatHistoryItem(expression, result) {
  const sanitised = sanitizeExpression(expression);
  return `${sanitised} = ${result}`;
}

export function appendHistory(historyList, entry) {
  const list = historyList.slice(-MAX_HISTORY + 1);
  list.push(entry);
  return list;
}

function normaliseNumber(value) {
  if (typeof value !== 'number') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? Number.NaN : parsed;
  }

  if (!Number.isFinite(value)) {
    return Number.NaN;
  }

  const rounded = Number.parseFloat(value.toPrecision(12));
  return rounded;
}

function tokenize(expression) {
  const tokens = [];
  let numberBuffer = '';
  let decimalUsed = false;

  const pushNumber = () => {
    if (numberBuffer === '') {
      return;
    }

    const value = Number(numberBuffer);
    if (!Number.isFinite(value)) {
      throw new Error('Invalid number');
    }

    tokens.push({ type: 'number', value });
    numberBuffer = '';
    decimalUsed = false;
  };

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];

    if (isDigit(char)) {
      numberBuffer += char;
      continue;
    }

    if (char === '.') {
      if (decimalUsed) {
        throw new Error('Invalid number format');
      }

      decimalUsed = true;
      numberBuffer = numberBuffer === '' ? '0.' : `${numberBuffer}.`;
      continue;
    }

    pushNumber();

    if (char === '(' || char === ')') {
      tokens.push({ type: 'paren', value: char });
      continue;
    }

    if (isOperatorChar(char)) {
      const previous = tokens.at(-1);
      const previousType = previous?.type ?? 'start';
      const previousIsOperator = previousType === 'operator' && !previous.value.startsWith('u');
      const previousIsOpenParen = previousType === 'paren' && previous.value === '(';
      const isUnary =
        (char === '-' || char === '+') && (previousType === 'start' || previousIsOperator || previousIsOpenParen);

      if (!isUnary && previousIsOperator) {
        throw new Error('Invalid operator sequence');
      }

      const operatorValue = isUnary ? (char === '-' ? 'u-' : 'u+') : char;
      tokens.push({ type: 'operator', value: operatorValue });
      continue;
    }

    throw new Error(`Unexpected token: ${char}`);
  }

  pushNumber();
  return tokens;
}

function toReversePolish(tokens) {
  const output = [];
  const stack = [];

  tokens.forEach((token) => {
    if (token.type === 'number') {
      output.push(token);
      return;
    }

    if (token.type === 'operator') {
      const config = OPERATOR_CONFIG[token.value];
      if (!config) {
        throw new Error(`Unsupported operator: ${token.value}`);
      }

      while (stack.length > 0) {
        const top = stack.at(-1);
        if (top.type !== 'operator') {
          break;
        }

        const topConfig = OPERATOR_CONFIG[top.value];
        if (!topConfig) {
          throw new Error(`Unsupported operator: ${top.value}`);
        }

        const shouldPop =
          (config.associativity === 'left' && topConfig.precedence >= config.precedence) ||
          (config.associativity === 'right' && topConfig.precedence > config.precedence);

        if (!shouldPop) {
          break;
        }

        output.push(stack.pop());
      }

      stack.push(token);
      return;
    }

    if (token.type === 'paren' && token.value === '(') {
      stack.push(token);
      return;
    }

    if (token.type === 'paren' && token.value === ')') {
      let foundOpening = false;

      while (stack.length > 0) {
        const popped = stack.pop();
        if (popped.type === 'paren' && popped.value === '(') {
          foundOpening = true;
          break;
        }
        output.push(popped);
      }

      if (!foundOpening) {
        throw new Error('Mismatched parentheses');
      }

      return;
    }

    throw new Error('Unexpected token in expression');
  });

  while (stack.length > 0) {
    const token = stack.pop();
    if (token.type === 'paren') {
      throw new Error('Mismatched parentheses');
    }
    output.push(token);
  }

  return output;
}

function evaluateReversePolish(tokens) {
  const stack = [];

  tokens.forEach((token) => {
    if (token.type === 'number') {
      stack.push(token.value);
      return;
    }

    if (token.type !== 'operator') {
      throw new Error('Unexpected token during evaluation');
    }

    const config = OPERATOR_CONFIG[token.value];
    if (!config) {
      throw new Error(`Unsupported operator: ${token.value}`);
    }

    if (config.operands === 1) {
      if (stack.length < 1) {
        throw new Error('Invalid expression');
      }
      const value = stack.pop();
      const result = config.fn(value);
      stack.push(result);
      return;
    }

    if (stack.length < 2) {
      throw new Error('Invalid expression');
    }

    const right = stack.pop();
    const left = stack.pop();
    const result = config.fn(left, right);
    stack.push(result);
  });

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
}

function isDigit(char) {
  return /[0-9]/.test(char);
}

function isOperatorChar(char) {
  return char === '+' || char === '-' || char === '*' || char === '/' || char === '^';
}
