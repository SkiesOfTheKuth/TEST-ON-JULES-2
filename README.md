# Scientific Calculator

An accessible scientific calculator web app with calculation history, keyboard controls, and theme switching. The project now ships with modern tooling, automated tests, and documentation to support production-ready workflows.

## Features
- Responsive and accessible calculator UI with opt-in persistent history and memory functions.
- Dark/light theme with system preference detection and user persistence.
- Input sanitisation backed by a hardened expression parser that supports parentheses, exponentiation, and unary operators.
- Automated linting (ESLint + Stylelint), formatting (Prettier), and unit tests (Vitest).

## Getting Started

### Prerequisites
- Node.js >= 18.18
- npm >= 9 (bundled with Node)

### Installation
```bash
npm install
```

### Available Scripts
```bash
npm run dev        # Start a static dev server at http://localhost:4173
npm test          # Run unit tests once
npm run test:watch # Run unit tests in watch mode
npm run coverage   # Run unit tests with coverage
npm run lint       # Run ESLint and Stylelint
npm run format     # Format files with Prettier
```

### Local Development
1. Install dependencies with `npm install`.
2. Start the dev server: `npm run dev`.
3. Open http://localhost:4173 in your browser.

## Project Structure
```
├── index.html            # Entry point with strict CSP and module loader
├── script.js             # UI logic (ES module)
├── src/
│   └── lib/
│       └── calculator.js # Pure calculation helpers & memory register
├── style.css             # Theming and layout
├── tests/                # Vitest unit tests
└── docs & tooling files  # README, SECURITY, lint configs, etc.
```

## Environment Configuration
- Secrets or environment-specific overrides go in `.env` files (not committed). Provide `.env.example` when environment variables are introduced.
- The calculator persists theme and opt-in history preferences in `localStorage`; history entries expire automatically after 30 days and never leave the device.

## Deployment
This is a static application. Any static host (Netlify, Vercel, GitHub Pages, S3, etc.) can serve the contents of the repository. Ensure cache headers are configured to allow quick updates (e.g., cache-busting by commit hash).

## Contributing
1. Fork the repository and create a feature branch.
2. Run `npm run lint` and `npm test` before opening a pull request.
3. Follow the architecture and security guidelines in `ARCHITECTURE.md` and `SECURITY.md`.

