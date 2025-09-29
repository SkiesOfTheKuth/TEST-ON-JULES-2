# Security Policy

## Supported Versions
Security fixes are applied to the `main` branch. Deployments should track the latest release tag or commit from `main`.

## Reporting a Vulnerability
- Email: security@example.com (replace with your security contact)
- Include a proof of concept, impact assessment, and suggested disclosure timeline.
- Encrypt sensitive reports using the team PGP key if available.

## Secure Development Guidelines
- All expressions are sanitised before evaluation (`src/lib/calculator.js`).
- Do not introduce libraries that evaluate arbitrary code without sandboxing.
- Avoid collecting personal data. If telemetry is required, ensure opt-in consent and documented retention periods.
- Rotate CDN/API keys every 90 days. Store secrets in platform-specific secret managers, never in source control.

## Disclosure Timeline
1. Acknowledge receipt within 2 business days.
2. Provide remediation plan within 7 days.
3. Target fix release within 30 days depending on severity.
4. Credit reporter if requested and consented.

