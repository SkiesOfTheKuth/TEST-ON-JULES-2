# Architecture Overview

## System Context
A single-page scientific calculator served as static assets. The UI is implemented with modern ES modules and relies on the `mathjs` library via import maps. Persistent client-side state is stored in `localStorage`.

```
+------------------+        HTTPS        +----------------------+
| Browser Client   | <-----------------> | Static Hosting (CDN) |
+------------------+                     +----------------------+
          |                                      |
          |  Import map fetches mathjs           |
          +--------------------------------------+
```

## Module Boundaries
- `index.html` declares the import map and bootstraps the UI module.
- `script.js` manages DOM events, user interactions, and persistence concerns.
- `src/lib/calculator.js` contains pure functions and the `MemoryRegister` class; it is unit-testable and shared between browser code and tests.
- `tests/` executes unit coverage using Vitest.

## Data Flow
1. User input is captured via button clicks or keyboard events.
2. Expressions are validated and evaluated using the shared library functions.
3. Results update the display and append to in-memory history capped at 50 entries.
4. History and theme preferences persist to `localStorage` for future sessions.

## Error Handling
- All evaluation paths throw descriptive errors when input is invalid or results are non-finite.
- UI layer catches errors, surfaces "Error" in the display, and logs details to the console for observability.

## Extensibility Notes
- Additional operations should be implemented within `src/lib/calculator.js` and exposed via exported functions.
- Consider extracting UI logic into a lightweight framework (Svelte/React) if state management grows.
- The import map allows swapping math providers (OSS or self-hosted) without changing application code.
