let calculationHistory = [];
let isResultDisplayed = false;
let memory = 0;

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

    const savedTheme = localStorage.getItem('calculator-theme') || 'light';
    applyTheme(savedTheme);

    // --- CLEAR HISTORY LOGIC ---
    clearHistoryButton.addEventListener('click', () => {
        clearHistory();
    });

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
        pressButton(key);

        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')', '^'].includes(key)) {
            display(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        } else if (key === 'Backspace' || key === 'Delete') {
            backspace();
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
    switch (action) {
        case 'clear':
            clearScreen();
            break;
        case 'equal':
            calculate();
            break;
        case 'sqrt':
            calculateSquareRoot();
            break;
        case 'percent':
            calculatePercentage();
            break;
        case 'backspace':
            backspace();
            break;
        case 'mem-clear':
            memoryClear();
            break;
        case 'mem-recall':
            memoryRecall();
            break;
        case 'mem-plus':
            memoryAdd();
            break;
        case 'mem-minus':
            memorySubtract();
            break;
        default:
            display(content);
            break;
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
        case '=': case 'enter':
            return document.querySelector('#equal');
        case 'c': case 'escape':
            return document.querySelector('#clear');
        case 'delete': case 'backspace':
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
        default:
            const buttons = document.querySelectorAll('.keys button');
            return Array.from(buttons).find(btn => btn.textContent === key);
    }
}

function display(value) {
    const resultInput = document.getElementById("result");
    const operators = ['+', '-', '*', '/', '^'];

    if (isResultDisplayed) {
        if (operators.includes(value) || value === '.') {
            isResultDisplayed = false;
        } else {
            resultInput.value = '';
            isResultDisplayed = false;
        }
    }

    resultInput.value += value;
}


function backspace() {
    const result = document.getElementById("result");
    result.value = result.value.slice(0, -1);
    isResultDisplayed = false;
}

function clearScreen() {
    document.getElementById("result").value = "";
    isResultDisplayed = false;
}

function triggerDisplayAnimation() {
    const display = document.querySelector('.display');
    display.classList.add('display-flip');
    display.addEventListener('animationend', () => {
        display.classList.remove('display-flip');
    }, { once: true });
}

function calculate() {
    const expression = document.getElementById("result").value;
    if (expression === "") return;

    try {
        const result = evaluateExpression(expression);
        document.getElementById("result").value = result;
        addToHistory(expression, result);
        isResultDisplayed = true;
        triggerDisplayAnimation();
    } catch (e) {
        document.getElementById("result").value = "Error";
        isResultDisplayed = true;
        triggerDisplayAnimation();
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
    triggerDisplayAnimation();
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
    triggerDisplayAnimation();
}

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    document.getElementById('result').value = memory;
    isResultDisplayed = true;
}

function memoryAdd() {
    const currentValue = evaluateExpression(document.getElementById('result').value);
    if (!isNaN(currentValue)) {
        memory += currentValue;
    }
}

function memorySubtract() {
    const currentValue = evaluateExpression(document.getElementById('result').value);
    if (!isNaN(currentValue)) {
        memory -= currentValue;
    }
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
    if (!expression) return 0;
    try {
        return math.evaluate(expression);
    } catch (error) {
        console.error("Calculation error:", error.message);
        return "Error";
    }
}