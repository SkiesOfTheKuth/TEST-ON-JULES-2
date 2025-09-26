const calculator = new Calculator();
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

        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
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
        } else if (key.toLowerCase() === 's') { // 's' for square root
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
    } else if (action === 'backspace') {
        const result = document.getElementById("result");
        result.value = result.value.slice(0, -1);
        isResultDisplayed = false;
    }
    else {
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
        case '(':
            return document.querySelector('#l-paren');
        case ')':
            return document.querySelector('#r-paren');
        case 'backspace':
            return document.querySelector('#backspace');
        default:
            const buttons = document.querySelectorAll('.keys button');
            return Array.from(buttons).find(btn => btn.textContent === key);
    }
}

function display(value) {
    const result = document.getElementById("result");
    const operators = ['+', '-', '*', '/'];

    if (isResultDisplayed) {
        // Allow starting a new calculation with an operator
        if (!operators.includes(value) && value !== '.') {
            result.value = ""; // Clear if a number is pressed
        }
        isResultDisplayed = false;
    }

    result.value += value;
}

function clearScreen() {
    document.getElementById("result").value = "";
    isResultDisplayed = false;
}

function calculate() {
    const expression = document.getElementById("result").value;
    const result = calculator.calculate(expression);
    document.getElementById("result").value = result;
    isResultDisplayed = true;
    updateHistory();
}

function calculateSquareRoot() {
    const expression = document.getElementById('result').value;
    const result = calculator.calculateSquareRoot(expression);
    document.getElementById('result').value = result;
    isResultDisplayed = true;
    updateHistory();
}

function calculatePercentage() {
    const expression = document.getElementById('result').value;
    const result = calculator.calculatePercentage(expression);
    document.getElementById('result').value = result;
    isResultDisplayed = true;
    updateHistory();
}

function updateHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    const history = calculator.getHistory();

    history.forEach(item => {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.expression} = ${item.result}`;
        listItem.addEventListener('click', () => {
            document.getElementById('result').value = item.expression;
        });
        historyList.appendChild(listItem);
    });

    historyList.scrollTop = historyList.scrollHeight;
}

function clearHistory() {
    calculator.clearHistory();
    updateHistory();
}