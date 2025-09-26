document.addEventListener('DOMContentLoaded', function() {
    const keys = document.querySelector('.keys');

    // Handle button clicks
    keys.addEventListener('click', event => {
        if (!event.target.matches('button')) {
            return;
        }

        const key = event.target;
        const action = key.id;
        const keyContent = key.textContent;

        if (action === 'clear') {
            clearScreen();
        } else if (action === 'equal') {
            calculate();
        } else if (action === 'sqrt') {
            calculateSquareRoot();
        } else if (action === 'percent') {
            calculatePercentage();
        } else {
            display(keyContent);
        }
    });

    // Handle keyboard input
    document.addEventListener('keydown', event => {
        const key = event.key;

        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.'].includes(key)) {
            display(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault(); // Prevent default browser action
            calculate();
        } else if (key === 'Backspace') {
            const result = document.getElementById("result");
            result.value = result.value.slice(0, -1);
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearScreen();
        } else if (key === '%') {
            calculatePercentage();
        } else if (key.toLowerCase() === 's') {
            calculateSquareRoot();
        }
    });
});


function display(value) {
    const result = document.getElementById("result");
    const lastChar = result.value.slice(-1);
    const operators = ['+', '-', '*', '/'];

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
}

function calculate() {
    const expression = document.getElementById("result").value;
    try {
        const result = evaluateExpression(expression);
        document.getElementById("result").value = result;
    } catch (e) {
        document.getElementById("result").value = "Error";
    }
}

function calculateSquareRoot() {
    const display = document.getElementById('result');
    const currentValue = parseFloat(display.value);
    if (!isNaN(currentValue) && currentValue >= 0) {
        display.value = Math.sqrt(currentValue);
    } else {
        display.value = 'Error';
    }
}

function calculatePercentage() {
    const display = document.getElementById('result');
    const currentValue = parseFloat(display.value);
    if (!isNaN(currentValue)) {
        // This implementation calculates the percentage of the number itself.
        // A more advanced implementation could handle percentages in expressions.
        display.value = currentValue / 100;
    }
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