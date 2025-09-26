export default class Calculator {
    constructor() {
        this.calculationHistory = [];
    }

    evaluateExpression(expression) {
        // This is a simple implementation of the Shunting-yard algorithm
        const precedence = {
            '+': 1,
            '-': 1,
            '*': 2,
            '/': 2
        };

        const isOperator = (char) => ['+', '-', '*', '/'].includes(char);
        const peek = (stack) => stack[stack.length - 1];

        const outputQueue = [];
        const operatorStack = [];
        const tokens = expression.match(/(\d+\.?\d*)|([+\-*/()])/g) || [];

        tokens.forEach(token => {
            if (!isNaN(parseFloat(token))) {
                outputQueue.push(parseFloat(token));
            } else if (isOperator(token)) {
                while (
                    operatorStack.length > 0 &&
                    isOperator(peek(operatorStack)) &&
                    precedence[peek(operatorStack)] >= precedence[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && peek(operatorStack) !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (peek(operatorStack) === '(') {
                    operatorStack.pop();
                } else {
                    throw new Error("Mismatched parentheses");
                }
            }
        });

        while (operatorStack.length > 0) {
            const operator = peek(operatorStack);
            if (operator === '(' || operator === ')') {
                throw new Error("Mismatched parentheses");
            }
            outputQueue.push(operatorStack.pop());
        }

        const resultStack = [];
        outputQueue.forEach(token => {
            if (typeof token === 'number') {
                resultStack.push(token);
            } else if (isOperator(token)) {
                const b = resultStack.pop();
                const a = resultStack.pop();
                switch (token) {
                    case '+':
                        resultStack.push(a + b);
                        break;
                    case '-':
                        resultStack.push(a - b);
                        break;
                    case '*':
                        resultStack.push(a * b);
                        break;
                    case '/':
                        if (b === 0) throw new Error("Division by zero");
                        resultStack.push(a / b);
                        break;
                }
            }
        });

        if (resultStack.length !== 1) {
            throw new Error("Invalid expression");
        }

        return resultStack[0];
    }

    calculate(expression) {
        if (expression === "") return;

        try {
            const result = this.evaluateExpression(expression);
            this.addToHistory(expression, result);
            return result;
        } catch (e) {
            return "Error";
        }
    }

    calculateSquareRoot(expression) {
        if (expression === "") return;

        try {
            const evaluatedValue = this.evaluateExpression(expression);
            if (isNaN(evaluatedValue) || evaluatedValue < 0) {
                return 'Error';
            } else {
                const result = Math.sqrt(evaluatedValue);
                this.addToHistory(`√(${expression})`, result);
                return result;
            }
        } catch (e) {
            return 'Error';
        }
    }

    calculatePercentage(expression) {
        if (expression === "") return;

        try {
            const evaluatedValue = this.evaluateExpression(expression);
            if (isNaN(evaluatedValue)) {
                return 'Error';
            } else {
                const result = evaluatedValue / 100;
                this.addToHistory(`(${expression})%`, result);
                return result;
            }
        } catch (e) {
            return 'Error';
        }
    }

    addToHistory(expression, result) {
        this.calculationHistory.push({ expression: expression, result: result });
    }

    getHistory() {
        return this.calculationHistory;
    }

    clearHistory() {
        this.calculationHistory = [];
    }
}