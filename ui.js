class UI {
    constructor() {
        this.resultInput = document.getElementById('result');
        this.historyList = document.getElementById('history-list');
        this.themeSwitcher = document.getElementById('theme-switcher');
        this.clearHistoryButton = document.getElementById('clear-history');
        this.body = document.body;
        this.keys = document.querySelector('.keys');

        this.isResultDisplayed = false;
    }

    // --- THEME ---
    applyTheme(theme) {
        this.body.classList.toggle('dark-theme', theme === 'dark');
        localStorage.setItem('calculator-theme', theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('calculator-theme') || 'light';
        this.applyTheme(savedTheme);
    }

    // --- DISPLAY ---
    display(value) {
        const operators = ['+', '-', '*', '/'];

        if (this.isResultDisplayed) {
            if (!operators.includes(value) && value !== '.') {
                this.resultInput.value = "";
            }
            this.isResultDisplayed = false;
        }

        const lastChar = this.resultInput.value.slice(-1);

        if (operators.includes(lastChar) && operators.includes(value)) {
            // Allow negative numbers
            if (value === '-' && lastChar !== '-') {
                 this.resultInput.value += value;
            }
            return;
        }

        // Prevent starting with an operator other than '-'
        if (this.resultInput.value === '' && operators.includes(value) && value !== '-') {
            return;
        }

        this.resultInput.value += value;
    }

    clearDisplay() {
        this.resultInput.value = "";
        this.isResultDisplayed = false;
    }

    backspace() {
        this.resultInput.value = this.resultInput.value.slice(0, -1);
        this.isResultDisplayed = false;
    }

    showResult(value) {
        this.resultInput.value = value;
        this.isResultDisplayed = true;
    }

    // --- HISTORY ---
    updateHistory(history) {
        this.historyList.innerHTML = '';
        history.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.expression} = ${item.result}`;
            this.historyList.appendChild(listItem);
        });
        this.historyList.scrollTop = this.historyList.scrollHeight;
    }

    // --- VISUALS ---
    pressButton(key) {
        const button = this.findButton(key);
        if (button) {
            button.classList.add('btn-active');
            setTimeout(() => {
                button.classList.remove('btn-active');
            }, 100);
        }
    }

    findButton(key) {
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
            case 'q': // for sqrt
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
}