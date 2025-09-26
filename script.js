import Calculator from './calculator.js';
import {
    appendToDisplay,
    updateDisplay,
    clearDisplay,
    backspace,
    getDisplayValue,
    initializeTheme,
    updateHistory,
    initializeHistory,
    pressButton
} from './ui.js';

function initializeCalculator() {
    const calculator = new Calculator();
    const keys = document.querySelector('.keys');

    initializeTheme();
    initializeHistory(() => {
        calculator.clearHistory();
        updateHistory(calculator.getHistory());
    });

    function handleCalculation(operation) {
        const expression = getDisplayValue();
        if (expression === "") return;

        let result;
        if (operation === 'calculate') {
            result = calculator.calculate(expression);
        } else if (operation === 'sqrt') {
            result = calculator.calculateSquareRoot(expression);
        } else if (operation === 'percent') {
            result = calculator.calculatePercentage(expression);
        }

        if (result !== undefined) {
            updateDisplay(result);
            updateHistory(calculator.getHistory());
        }
    }

    // Handle button clicks
    keys.addEventListener('click', event => {
        if (!event.target.matches('button')) return;

        const button = event.target;
        const action = button.id;
        const content = button.textContent;

        switch (action) {
            case 'clear':
                clearDisplay();
                break;
            case 'equal':
                handleCalculation('calculate');
                break;
            case 'sqrt':
                handleCalculation('sqrt');
                break;
            case 'percent':
                handleCalculation('percent');
                break;
            case 'backspace':
                backspace();
                break;
            default:
                appendToDisplay(content);
                break;
        }
    });

    // Handle keyboard input
    document.addEventListener('keydown', event => {
        const key = event.key;
        pressButton(key);

        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
            appendToDisplay(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            handleCalculation('calculate');
        } else if (key === 'Backspace') {
            backspace();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
        } else if (key === '%') {
            handleCalculation('percent');
        } else if (key.toLowerCase() === 's') {
            handleCalculation('sqrt');
        }
    });
}

// Since scripts with type="module" are deferred, we need to ensure the DOM is loaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCalculator);
} else {
    initializeCalculator();
}