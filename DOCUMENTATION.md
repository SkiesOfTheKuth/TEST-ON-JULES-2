# Project Documentation

This document provides a detailed breakdown of the project's codebase, including the structure of the HTML, the styling approach, and the functionality of the JavaScript code.

## File Structure

-   **`index.html`**: The HTML file that defines the structure of the application.
-   **`style.css`**: The CSS file for styling the calculator and its components.
-   **`script.js`**: The JavaScript file that contains all the logic for the calculator.

---

## `index.html`

The `index.html` file is the entry point of the application. It sets up the user interface, which is divided into three main sections: the header, the calculator, and the history panel.

### Key Components:

-   **Header**: Contains the main title and a `theme-switcher` button to toggle between light and dark modes.
-   **Calculator**:
    -   **Display**: An `<input>` field with the `id="result"` where numbers and results are shown. It is `disabled` to prevent direct text input.
    -   **Keys**: A grid of `<button>` elements for all the numbers, operators, and functions (`C`, `√`, `%`, `/`, `*`, `-`, `+`, `=`).
-   **History Panel**:
    -   **Header**: Includes a title and a `clear-history` button.
    -   **History List**: A `<ul>` with the `id="history-list"` where past calculations are dynamically added.

The file links to `style.css` for styling and `script.js` for functionality.

---

## `style.css`

The `style.css` file controls the visual appearance of the calculator. It uses CSS variables for easy theming and maintainability.

### Theming:

-   **CSS Variables (`:root`)**: Defines a set of color variables for the default (light) theme.
-   **Dark Theme (`.dark-theme`)**: A class that overrides the default CSS variables with colors for the dark theme. This class is toggled on the `<body>` element by the JavaScript.

### Layout:

-   **Flexbox**: Used for the main layout (`app-container`, `header`, `main-container`) to align components.
-   **Grid**: Used for the calculator keys (`.keys`) to create a structured button layout.

### Key Styles:

-   **Button States**: Includes styles for `hover` and `active` states to provide visual feedback to the user.
-   **Responsive Elements**: The layout is designed to be clean and functional on different screen sizes.

---

## `script.js`

This file contains all the logic that powers the calculator. It handles user input, performs calculations, manages history, and controls theme switching.

### Global Variables:

-   `calculationHistory`: An array that stores objects, where each object represents a past calculation (`{ expression, result }`).
-   `isResultDisplayed`: A boolean flag to track whether the current value in the display is a result of a calculation. This helps in deciding whether to append to or overwrite the display content.

### Core Functions:

-   **`handleAction(action, content)`**: A central handler that directs button clicks to the appropriate function based on the button's `id` or text content.

-   **`display(value)`**: Appends the clicked button's value to the display. It contains logic to prevent invalid inputs, such as starting with an operator or adding multiple operators consecutively.

-   **`calculate()`**: Evaluates the expression in the display using the `evaluateExpression` function. On success, it updates the display with the result and adds the calculation to the history. It shows "Error" on failure.

-   **`calculateSquareRoot()`** and **`calculatePercentage()`**: Handle the special `√` and `%` operations. They first evaluate the current expression before applying the specific mathematical function.

-   **`evaluateExpression(expression)`**: A safe evaluation function. It first sanitizes the expression to remove any characters that are not part of a valid calculation and then uses `new Function('return ' + expression)()` to compute the result. This is generally safer than `eval()`.

-   **`addToHistory(expression, result)`**: Adds a new calculation to the `calculationHistory` array and calls `updateHistory()` to refresh the UI.

-   **`updateHistory()`**: Clears and re-renders the history list in the UI based on the `calculationHistory` array.

-   **`clearHistory()`**: Empties the `calculationHistory` array and updates the UI.

-   **`clearScreen()`**: Clears the calculator display.

### Event Handling:

-   **`DOMContentLoaded`**: An event listener that runs when the page is fully loaded. It initializes all other event listeners.
-   **Button Clicks**: An event listener on the `.keys` container captures all button clicks, delegating them to the `handleAction` function.
-   **Keyboard Input**: An event listener on the `document` captures keyboard presses. It maps keys like `0-9`, operators, `Enter`, `Backspace`, and `Escape` to corresponding calculator actions.
-   **Theme Switching**: A click listener on the `theme-switcher` button toggles the theme and saves the preference to `localStorage`.
-   **History Clearing**: A click listener on the `clear-history` button clears the calculation history.