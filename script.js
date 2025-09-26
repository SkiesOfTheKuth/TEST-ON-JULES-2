document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const calculator = new Calculator();

    // --- INITIALIZATION ---
    ui.loadTheme();
    ui.updateHistory(calculator.getHistory());

    // --- EVENT LISTENERS ---

    // Theme switcher
    ui.themeSwitcher.addEventListener('click', () => {
        const isDark = ui.body.classList.contains('dark-theme');
        ui.applyTheme(isDark ? 'light' : 'dark');
    });

    // Clear history
    ui.clearHistoryButton.addEventListener('click', () => {
        calculator.clearHistory();
        ui.updateHistory(calculator.getHistory());
    });

    // Handle button clicks
    ui.keys.addEventListener('click', event => {
        if (!event.target.matches('button')) return;
        const button = event.target;
        const action = button.id;
        const content = button.textContent;
        handleAction(action, content);
    });

    // Handle keyboard input
    document.addEventListener('keydown', event => {
        const key = event.key;
        ui.pressButton(key); // Provide visual feedback for key press
        handleKeyboardInput(key);
    });

    // --- ACTION HANDLERS ---

    function handleAction(action, content) {
        switch (action) {
            case 'clear':
                ui.clearDisplay();
                break;
            case 'backspace':
                ui.backspace();
                break;
            case 'equal':
                calculateAndDisplay();
                break;
            case 'sqrt':
                calculateAndDisplay('sqrt');
                break;
            case 'percent':
                calculateAndDisplay('percent');
                break;
            default:
                ui.display(content);
                break;
        }
    }

    function handleKeyboardInput(key) {
        if ((key >= '0' && key <= '9') || ['+', '-', '*', '/', '.', '(', ')'].includes(key)) {
            ui.display(key);
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculateAndDisplay();
        } else if (key === 'Backspace') {
            ui.backspace();
        } else if (key.toLowerCase() === 'c' || key === 'Escape') {
            ui.clearDisplay();
        } else if (key === '%') {
            calculateAndDisplay('percent');
        } else if (key.toLowerCase() === 'q') { // 'q' for sqrt, since 's' might be used for other things
            calculateAndDisplay('sqrt');
        }
    }

    function calculateAndDisplay(type = 'normal') {
        const expression = ui.resultInput.value;
        if (expression === "") return;

        let result;
        switch (type) {
            case 'sqrt':
                result = calculator.calculateSquareRoot(expression);
                break;
            case 'percent':
                result = calculator.calculatePercentage(expression);
                break;
            default:
                result = calculator.calculate(expression);
                break;
        }

        ui.showResult(result);
        ui.updateHistory(calculator.getHistory());
    }
});