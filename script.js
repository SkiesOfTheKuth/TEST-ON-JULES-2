import {
  MemoryRegister,
  appendHistory,
  evaluateExpression,
  evaluatePercentage,
  evaluateSquareRoot,
  formatHistoryItem,
  sanitizeExpression
} from './src/lib/calculator.js';

const THEME_STORAGE_KEY = 'calculator-theme';
const HISTORY_STORAGE_KEY = 'calculator-history-v1';
const HISTORY_CONSENT_KEY = 'calculator-history-consent';
const HISTORY_RETENTION_MS = 1000 * 60 * 60 * 24 * 30;
const MAX_DISPLAY_LENGTH = 32;

const memoryRegister = new MemoryRegister();
let calculationHistory = [];
let isResultDisplayed = false;
let hasHistoryConsent = false;

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelector('.keys');
    const themeSwitcher = document.getElementById('theme-switcher');
    const clearHistoryButton = document.getElementById('clear-history');
    const historyList = document.getElementById('history-list');
    const historyConsentToggle = document.getElementById('history-consent');
    const resultInput = document.getElementById('result');

    restoreTheme(themeSwitcher);
    hasHistoryConsent = restoreHistoryConsent(historyConsentToggle);
    calculationHistory = restoreHistory(historyList, hasHistoryConsent);
    updateHistoryConsentNote(hasHistoryConsent);

    themeSwitcher?.addEventListener('click', () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      const nextTheme = isDark ? 'light' : 'dark';
      applyTheme(nextTheme, themeSwitcher);
    });

    historyConsentToggle?.addEventListener('change', (event) => {
      if (!isCheckboxElement(event.target)) {
        return;
      }

      hasHistoryConsent = event.target.checked;
      persistHistoryConsent(hasHistoryConsent);

      if (!hasHistoryConsent) {
        calculationHistory = [];
        clearPersistedHistory();
      } else {
        persistHistory(calculationHistory);
      }

      updateHistory(historyList, calculationHistory);
      updateHistoryConsentNote(hasHistoryConsent);
    });

    clearHistoryButton?.addEventListener('click', () => {
      calculationHistory = [];
      persistHistory(calculationHistory);
      updateHistory(historyList, calculationHistory);
    });

    keys?.addEventListener('click', (event) => {
      if (!(event.target instanceof HTMLButtonElement)) {
        return;
      }
      handleAction(event.target.id, event.target.textContent ?? '', historyList, resultInput);
    });

    document.addEventListener('keydown', (event) => {
      if (!resultInput) {
        return;
      }
      const key = event.key;
      pressButton(key);

      if (isInputKey(key)) {
        event.preventDefault();
        display(key, resultInput);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate(historyList, resultInput);
      } else if (key === 'Backspace' || key === 'Delete') {
        event.preventDefault();
        backspace(resultInput);
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        event.preventDefault();
        clearScreen(resultInput);
      } else if (key === '%') {
        event.preventDefault();
        calculatePercentageValue(historyList, resultInput);
      } else if (key.toLowerCase() === 's') {
        event.preventDefault();
        calculateSquareRootValue(historyList, resultInput);
      }
    });
  });
}

function handleAction(action, content, historyList, resultInput) {
  switch (action) {
    case 'clear':
      clearScreen(resultInput);
      break;
    case 'equal':
      calculate(historyList, resultInput);
      break;
    case 'sqrt':
      calculateSquareRootValue(historyList, resultInput);
      break;
    case 'percent':
      calculatePercentageValue(historyList, resultInput);
      break;
    case 'backspace':
      backspace(resultInput);
      break;
    case 'mem-clear':
      memoryRegister.clear();
      break;
    case 'mem-recall':
      resultInput.value = formatResult(memoryRegister.recall());
      isResultDisplayed = true;
      break;
    case 'mem-plus':
      memoryRegister.add(parseFloat(resultInput.value));
      break;
    case 'mem-minus':
      memoryRegister.subtract(parseFloat(resultInput.value));
      break;
    default:
      display(content, resultInput);
      break;
  }
}

function pressButton(key) {
  const button = findButton(key);
  if (button) {
    button.classList.add('btn-active');
    globalThis.setTimeout(() => {
      button.classList.remove('btn-active');
    }, 100);
  }
}

function findButton(key) {
  if (typeof document === 'undefined') {
    return null;
  }
  const normalised = key.toLowerCase();
  switch (normalised) {
    case '=':
    case 'enter':
      return document.querySelector('#equal');
    case 'c':
    case 'escape':
      return document.querySelector('#clear');
    case 'delete':
    case 'backspace':
      return document.querySelector('#backspace');
    case '%':
      return document.querySelector('#percent');
    case 's':
      return document.querySelector('#sqrt');
    case '(':
      return document.querySelector('#l-paren');
    case ')':
      return document.querySelector('#r-paren');
    case '^':
      return document.querySelector('#exponent');
    case '+':
      return document.querySelector('#add');
    case '-':
      return document.querySelector('#subtract');
    case '*':
      return document.querySelector('#multiply');
    case '/':
      return document.querySelector('#divide');
    default:
      return Array.from(document.querySelectorAll('.keys button')).find(
        (btn) => btn.textContent === key
      );
  }
}

function display(value, resultInput) {
  if (!value || !resultInput) {
    return;
  }

  const allowed = /^[0-9+\-*/^().]$/;
  if (!allowed.test(value)) {
    return;
  }

  if (isResultDisplayed) {
    const operators = ['+', '-', '*', '/', '^'];
    if (!operators.includes(value)) {
      resultInput.value = '';
    }
    isResultDisplayed = false;
  }

  if (resultInput.value.length >= MAX_DISPLAY_LENGTH) {
    return;
  }

  resultInput.value += value;
}

function backspace(resultInput) {
  if (!resultInput) {
    return;
  }
  resultInput.value = resultInput.value.slice(0, -1);
  isResultDisplayed = false;
}

function clearScreen(resultInput) {
  if (!resultInput) {
    return;
  }
  resultInput.value = '';
  isResultDisplayed = false;
}

function calculate(historyList, resultInput) {
  if (!resultInput || !historyList) {
    return;
  }

  const expression = resultInput.value;
  if (!expression) {
    return;
  }

  try {
    const result = evaluateExpression(expression);
    resultInput.value = formatResult(result);
    calculationHistory = appendHistory(
      calculationHistory,
      formatHistoryItem(expression, resultInput.value)
    );
    persistHistory(calculationHistory);
    updateHistory(historyList, calculationHistory);
    markResultDisplayed();
  } catch (error) {
    handleError(resultInput, error);
  }
}

function calculateSquareRootValue(historyList, resultInput) {
  if (!resultInput || !historyList || !resultInput.value) {
    return;
  }

  try {
    const result = evaluateSquareRoot(resultInput.value);
    const historyLabel = `√(${sanitizeExpression(resultInput.value)})`;
    resultInput.value = formatResult(result);
    calculationHistory = appendHistory(
      calculationHistory,
      formatHistoryItem(historyLabel, resultInput.value)
    );
    persistHistory(calculationHistory);
    updateHistory(historyList, calculationHistory);
    markResultDisplayed();
  } catch (error) {
    handleError(resultInput, error);
  }
}

function calculatePercentageValue(historyList, resultInput) {
  if (!resultInput || !historyList || !resultInput.value) {
    return;
  }

  try {
    const result = evaluatePercentage(resultInput.value);
    const historyLabel = `(${sanitizeExpression(resultInput.value)})%`;
    resultInput.value = formatResult(result);
    calculationHistory = appendHistory(
      calculationHistory,
      formatHistoryItem(historyLabel, resultInput.value)
    );
    persistHistory(calculationHistory);
    updateHistory(historyList, calculationHistory);
    markResultDisplayed();
  } catch (error) {
    handleError(resultInput, error);
  }
}

function handleError(resultInput, error) {
  console.error('Calculation error:', error);
  if (resultInput) {
    resultInput.value = 'Error';
    markResultDisplayed();
  }
}

function markResultDisplayed() {
  isResultDisplayed = true;
  triggerDisplayAnimation();
}

function triggerDisplayAnimation() {
  if (typeof document === 'undefined') {
    return;
  }

  const display = document.querySelector('.display');
  if (!display) {
    return;
  }
  display.classList.add('display-flip');
  display.addEventListener(
    'animationend',
    () => {
      display.classList.remove('display-flip');
    },
    { once: true }
  );
}

function updateHistory(historyList, history) {
  if (!historyList) {
    return;
  }

  historyList.innerHTML = '';
  history.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.textContent = item;
    historyList.append(listItem);
  });

  historyList.scrollTop = historyList.scrollHeight;
}

function restoreHistory(historyList, consentGranted) {
  if (!consentGranted) {
    updateHistory(historyList, []);
    return [];
  }

  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    const payload = Array.isArray(parsed)
      ? { entries: parsed, savedAt: Date.now() }
      : parsed;

    if (!payload || !Array.isArray(payload.entries)) {
      return [];
    }

    if (
      typeof payload.savedAt === 'number' &&
      Date.now() - payload.savedAt > HISTORY_RETENTION_MS
    ) {
      clearPersistedHistory();
      return [];
    }

    updateHistory(historyList, payload.entries);
    return payload.entries;
  } catch (error) {
    console.error('Unable to restore history', error);
    return [];
  }
}

function persistHistory(history) {
  if (!hasHistoryConsent) {
    clearPersistedHistory();
    return;
  }

  try {
    const payload = { entries: history, savedAt: Date.now() };
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Unable to persist history', error);
  }
}

function clearPersistedHistory() {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Unable to clear history', error);
  }
}

function restoreHistoryConsent(toggle) {
  try {
    const stored = localStorage.getItem(HISTORY_CONSENT_KEY);
    const consentGranted = stored === 'true';
    if (isCheckboxElement(toggle)) {
      toggle.checked = consentGranted;
    }
    return consentGranted;
  } catch (error) {
    console.error('Unable to read consent preference', error);
    return false;
  }
}

function persistHistoryConsent(consentGranted) {
  try {
    if (consentGranted) {
      localStorage.setItem(HISTORY_CONSENT_KEY, 'true');
    } else {
      localStorage.removeItem(HISTORY_CONSENT_KEY);
      clearPersistedHistory();
    }
  } catch (error) {
    console.error('Unable to persist consent preference', error);
  }
}

function updateHistoryConsentNote(consentGranted) {
  const note = document.getElementById('history-consent-note');
  if (!note) {
    return;
  }

  note.textContent = consentGranted
    ? 'History is stored locally for up to 30 days. Clear it anytime from this panel.'
    : 'History is not saved until you opt in. Calculations disappear when you leave the page.';
}

function isCheckboxElement(element) {
  return (
    typeof HTMLInputElement !== 'undefined' &&
    element instanceof HTMLInputElement &&
    element.type === 'checkbox'
  );
}

function restoreTheme(themeSwitcher) {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : 'light');
  applyTheme(theme, themeSwitcher);
}

function applyTheme(theme, themeSwitcher) {
  document.documentElement.dataset.theme = theme;
  themeSwitcher?.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function formatResult(value) {
  return Number.isFinite(value) ? String(value) : 'Error';
}

function isInputKey(key) {
  return /^[0-9+\-*/^().]$/.test(key);
}

export {
  applyTheme,
  calculate,
  calculatePercentageValue,
  calculateSquareRootValue,
  clearScreen,
  display,
  handleAction,
  isInputKey,
  pressButton,
  restoreHistory,
  sanitizeExpression
};
