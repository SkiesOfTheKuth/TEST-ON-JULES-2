import { create, all } from 'mathjs';

const math = create(all, {});
const SAFE_EXPRESSION = /^[0-9+\-*/^().\s]+$/;
const MAX_HISTORY = 50;

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

  const result = math.evaluate(expression);
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
