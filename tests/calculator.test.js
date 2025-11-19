import { describe, expect, it } from 'vitest';
import {
  MemoryRegister,
  appendHistory,
  evaluateExpression,
  evaluatePercentage,
  evaluateSquareRoot,
  formatHistoryItem,
  sanitizeExpression
} from '../src/lib/calculator.js';

describe('sanitizeExpression', () => {
  it('trims whitespace and removes internal spaces', () => {
    expect(sanitizeExpression(' 1 + 2 ')).toBe('1+2');
  });

  it('rejects unsupported characters', () => {
    expect(() => sanitizeExpression('alert(1)')).toThrow(/unsupported/i);
  });
});

describe('evaluateExpression', () => {
  it('evaluates valid arithmetic', () => {
    expect(evaluateExpression('2+3*4')).toBe(14);
  });

  it('throws on invalid expression', () => {
    expect(() => evaluateExpression('2++3')).toThrow();
  });

  it('supports exponentiation with right associativity', () => {
    expect(evaluateExpression('2^3^2')).toBe(512);
  });

  it('evaluates unary minus and parentheses', () => {
    expect(evaluateExpression('-(2+3)')).toBe(-5);
  });

  it('throws on division by zero', () => {
    expect(() => evaluateExpression('10/0')).toThrow(/divide by zero/i);
  });

  it('throws on mismatched parentheses', () => {
    expect(() => evaluateExpression('(2+3')).toThrow(/parentheses/i);
  });
});

describe('evaluateSquareRoot', () => {
  it('returns the square root', () => {
    expect(evaluateSquareRoot('9')).toBe(3);
  });

  it('throws on negative numbers', () => {
    expect(() => evaluateSquareRoot('-4')).toThrow(/square root/);
  });
});

describe('evaluatePercentage', () => {
  it('divides by 100', () => {
    expect(evaluatePercentage('200')).toBe(2);
  });
});

describe('formatHistoryItem', () => {
  it('formats expression and result', () => {
    expect(formatHistoryItem('1 + 1', 2)).toBe('1+1 = 2');
  });
});

describe('appendHistory', () => {
  it('caps the list at 50 entries', () => {
    const history = Array.from({ length: 50 }, (_, index) => `item-${index}`);
    const updated = appendHistory(history, 'new-item');
    expect(updated).toHaveLength(50);
    expect(updated.at(-1)).toBe('new-item');
  });
});

describe('MemoryRegister', () => {
  it('stores and recalls a value', () => {
    const memory = new MemoryRegister();
    memory.add(5);
    expect(memory.recall()).toBe(5);
  });

  it('clears the stored value', () => {
    const memory = new MemoryRegister();
    memory.add(5);
    memory.clear();
    expect(memory.recall()).toBe(0);
  });
});
