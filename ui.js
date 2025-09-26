// --- THEME ---
export function applyTheme(theme) {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('calculator-theme', theme);
}

export function initializeTheme() {
    const themeSwitcher = document.getElementById('theme-switcher');
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    applyTheme(savedTheme);
    themeSwitcher.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
    });
}

// --- DISPLAY ---
let isResultDisplayed = false;

export function appendToDisplay(value) {
    const resultInput = document.getElementById('result');
    const operators = ['+', '-', '*', '/'];

    if (isResultDisplayed) {
        if (!operators.includes(value) && value !== '.') {
            resultInput.value = "";
        }
        isResultDisplayed = false;
    }

    const lastChar = resultInput.value.slice(-1);

    if (operators.includes(lastChar) && operators.includes(value)) {
        if (value === '-' && lastChar !== '-') {
             resultInput.value += value;
        }
        return;
    }

    if (resultInput.value === '' && operators.includes(value) && value !== '-') {
        return;
    }

    resultInput.value += value;
}

export function updateDisplay(value) {
    const resultInput = document.getElementById('result');
    resultInput.value = value;
    isResultDisplayed = true;
}

export function clearDisplay() {
    const resultInput = document.getElementById('result');
    resultInput.value = "";
    isResultDisplayed = false;
}

export function backspace() {
    const resultInput = document.getElementById('result');
    resultInput.value = resultInput.value.slice(0, -1);
    isResultDisplayed = false;
}

export function getDisplayValue() {
    const resultInput = document.getElementById('result');
    return resultInput.value;
}

// --- HISTORY ---
export function updateHistory(calculationHistory) {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    calculationHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.expression} = ${item.result}`;
        historyList.appendChild(listItem);
    });
    historyList.scrollTop = historyList.scrollHeight;
}

export function initializeHistory(clearHistoryCallback) {
    const clearHistoryButton = document.getElementById('clear-history');
    clearHistoryButton.addEventListener('click', () => {
        clearHistoryCallback();
        updateHistory([]);
    });
}

// --- KEYBOARD & BUTTONS ---
export function pressButton(key) {
    const button = findButton(key);
    if (button) {
        button.classList.add('btn-active');
        setTimeout(() => {
            button.classList.remove('btn-active');
        }, 100);
    }
}

function findButton(key) {
    switch (key.toLowerCase()) {
        case '=':
        case 'enter':
            return document.querySelector('#equal');
        case 'c':
        case 'escape':
            return document.querySelector('#clear');
        case '%':
            return document.querySelector('#percent');
        case 's':
            return document.querySelector('#sqrt');
        default:
            const buttons = document.querySelectorAll('.keys button');
            return Array.from(buttons).find(btn => btn.textContent === key);
    }
}