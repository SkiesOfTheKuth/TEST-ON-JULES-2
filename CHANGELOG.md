# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2023-10-27

### Added

-   **Initial Release**: The first version of the web-based calculator.
-   **Core Functionality**:
    -   Basic arithmetic operations: addition, subtraction, multiplication, and division.
    -   Advanced calculations: square root (`√`) and percentage (`%`).
-   **Features**:
    -   **Calculation History**: A panel to display a log of all calculations made during a session.
    -   **Theme Switching**: A button to toggle between a light and a dark theme. The selected theme is saved in `localStorage` and persists across sessions.
    -   **Keyboard Support**: The ability to perform calculations using the keyboard for numbers, operators, and common actions (`Enter` for equals, `Escape` for clear).
-   **User Interface**:
    -   A clean, grid-based layout for the calculator buttons.
    -   A display screen for showing input and results.
    -   Visual feedback for button presses.
-   **Codebase**:
    -   `index.html`: The main structure of the application.
    -   `style.css`: Styles for the layout, theming, and responsive design.
    -   `script.js`: The core logic for calculations, history management, and theme control.