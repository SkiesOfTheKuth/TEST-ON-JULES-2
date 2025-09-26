let calculationHistory = [];
let isResultDisplayed = false; // Flag to track if the last action was a calculation

document.addEventListener('DOMContentLoaded', function() {
    const keys = document.querySelector('.keys');
    const themeSwitcher = document.getElementById('theme-switcher');
    const clearHistoryButton = document.getElementById('clear-history');
    const body = document.body;

    // --- THEME SWITCHER LOGIC ---
    const applyTheme = (theme) => {
        body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('calculator-theme', theme);
    };

    themeSwitcher.addEventListener('click', () => {
        const isDark = body.classList.contains('dark-theme');
        applyTheme(isDark ? 'light' : 'dark');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    applyTheme(savedTheme);
    // --- END THEME SWITCHER LOGIC ---

    // --- CLEAR HISTORY LOGIC ---
    clearHistoryButton.addEventListener('click', () => {
        clearHistory();
    });
    // --- END CLEAR HISTORY LOGIC ---

    // Handle button clicks
    keys.addEventListener('click', event => {
        if (!event.target.matches('button')) {
            return;
        }
        handleAction(event.target.id, event.target.textContent);
    });

    // Handle keyboard input
    document.addEventListener('keydown', event => {
        const key = event.key;
        pressButton(key); // Provide visual feedback for key press

        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.'].includes(key)) {
            display(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        } else if (key === 'Backspace') {
            const result = document.getElementById("result");
            result.value = result.value.slice(0, -1);
            isResultDisplayed = false; // User is editing
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearScreen();
        } else if (key === '%') {
            calculatePercentage();
        } else if (key.toLowerCase() === 's') {
            calculateSquareRoot();
        }
    });
});

function handleAction(action, content) {
    if (action === 'clear') {
        clearScreen();
    } else if (action === 'equal') {
        calculate();
    } else if (action === 'sqrt') {
        calculateSquareRoot();
    } else if (action === 'percent') {
        calculatePercentage();
    } else {
        display(content);
    }
}

function pressButton(key) {
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

function display(value) {
    const result = document.getElementById("result");
    const operators = ['+', '-', '*', '/'];

    if (isResultDisplayed) {
        if (!operators.includes(value) && value !== '.') {
            result.value = "";
        }
        isResultDisplayed = false;
    }

    const lastChar = result.value.slice(-1);

    if (operators.includes(lastChar) && operators.includes(value)) {
        if (value === '-' && lastChar !== '-') {
             result.value += value;
        }
        return;
    }

    if (result.value === '' && operators.includes(value) && value !== '-') {
        return;
    }

    result.value += value;
}

function clearScreen() {
    document.getElementById("result").value = "";
    isResultDisplayed = false;
}

function calculate() {
    const expression = document.getElementById("result").value;
    if (expression === "") return;

    try {
        const result = evaluateExpression(expression);
        document.getElementById("result").value = result;
        addToHistory(expression, result);
        isResultDisplayed = true;
    } catch (e) {
        document.getElementById("result").value = "Error";
        isResultDisplayed = true;
    }
}

function calculateSquareRoot() {
    const display = document.getElementById('result');
    const expression = display.value;
    if (expression === "") return;

    try {
        const evaluatedValue = evaluateExpression(expression);
        if (isNaN(evaluatedValue) || evaluatedValue < 0) {
            display.value = 'Error';
        } else {
            const result = Math.sqrt(evaluatedValue);
            addToHistory(`√(${expression})`, result);
            display.value = result;
        }
    } catch (e) {
        display.value = 'Error';
    }
    isResultDisplayed = true;
}

function calculatePercentage() {
    const display = document.getElementById('result');
    const expression = display.value;
    if (expression === "") return;

    try {
        const evaluatedValue = evaluateExpression(expression);
        if (isNaN(evaluatedValue)) {
            display.value = 'Error';
        } else {
            const result = evaluatedValue / 100;
            addToHistory(`(${expression})%`, result);
            display.value = result;
        }
    } catch (e) {
        display.value = 'Error';
    }
    isResultDisplayed = true;
}


function addToHistory(expression, result) {
    calculationHistory.push({ expression, result });
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';

    calculationHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.expression} = ${item.result}`;
        historyList.appendChild(listItem);
    });

    historyList.scrollTop = historyList.scrollHeight;
}

function clearHistory() {
    calculationHistory = [];
    updateHistory();
}

function evaluateExpression(expression) {
    const sanitizedExpression = expression.replace(/[^-()\d/*+.]/g, '');

    if (sanitizedExpression !== expression) {
        throw new Error("Invalid characters in expression");
    }

    let finalExpression = sanitizedExpression;
    const lastChar = finalExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
        finalExpression = finalExpression.slice(0, -1);
    }

    if (finalExpression === "") return "";

    try {
         return new Function('return ' + finalExpression)();
    } catch (error) {
        console.error("Calculation error:", error);
        return "Error";
    }
}