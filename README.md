# Playwright UI and API Testing Demo

A small, portfolio-ready Playwright Test project written in TypeScript. It demonstrates browser-based UI automation and direct API testing with reusable page objects, isolated tests, multiple browser engines, and CI reporting.

## What is included

- **UI tests:** TodoMVC workflows for adding, completing, filtering, and deleting todos.
- **API tests:** JSONPlaceholder examples for reading a post, filtering posts, and creating a post.
- **Browser projects:** Chromium, Firefox, and WebKit for UI coverage.
- **API project:** Runs independently from browser projects using Playwright's request fixture.
- **Diagnostics:** HTML and JUnit reports, plus screenshots, videos, and traces on failure.
- **GitHub Actions:** Type-checks and runs the UI and API suites on pushes and pull requests to `main`.

## Requirements

- Node.js 20 or newer
- npm
- Network access to the demo UI and API services

## Quick start

```sh
npm ci
npx playwright install
npm run typecheck
npm test
```

`npm test` runs the UI suite in Chromium, Firefox, and WebKit, then runs the API suite. The API uses JSONPlaceholder, a free demo service; its create endpoint returns a simulated response and does not persist data.

## New to Playwright?

Start with the [Beginner's Learning Guide](docs/learning-guide.md). It explains how this project is organized, traces a UI and API test from setup to assertion, introduces the Playwright concepts used here, and gives you small exercises to try.

## Run tests

```sh
npm test                    # All UI browser projects and API tests
npm run test:chromium        # UI tests in Chromium only
npm run test:firefox         # UI tests in Firefox only
npm run test:webkit          # UI tests in WebKit only
npm run test:api             # API tests only
npm run test:headed          # Run with a visible browser
npm run test:ui              # Open Playwright's interactive test UI
npm run test:debug           # Run with the Playwright debugger
npm run typecheck            # Check TypeScript without emitting files
```

The default UI target is the public TodoMVC demo at `https://demo.playwright.dev/todomvc/`. Override it when testing another deployment of the same app:

PowerShell:

```powershell
$env:BASE_URL = "https://your-test-host.example/"
npm run test:chromium
```

macOS/Linux:

```sh
BASE_URL=https://your-test-host.example/ npm run test:chromium
```

The API project defaults to `https://jsonplaceholder.typicode.com`. Set `API_BASE_URL` to use a compatible API:

PowerShell:

```powershell
$env:API_BASE_URL = "https://your-api-host.example/"
npm run test:api
```

macOS/Linux:

```sh
API_BASE_URL=https://your-api-host.example/ npm run test:api
```

## Reports and diagnostics

Each run writes a Playwright HTML report to `playwright-report/` and JUnit XML to `test-results/junit.xml`. Screenshots, videos, and traces are retained on failure. Open the latest HTML report with:

```sh
npm run report
```

Generated reports, test results, dependencies, local npm cache files, and browser session data are excluded from Git.

## Project structure

```text
playwright.config.ts             Test settings, reporters, and UI/API projects
tests/
  fixtures/test.ts               Shared typed TodoMVC fixture
  pages/todo-page.ts             TodoMVC page object
  todomvc.spec.ts                Browser UI scenarios
  api/posts.spec.ts              REST API scenarios
.github/workflows/playwright.yml GitHub Actions workflow
docs/learning-guide.md           Beginner walkthrough and exercises
specs/                           Test plans and scope notes
```

## Extending the demo

1. Add UI scenarios to `tests/todomvc.spec.ts` and reusable interactions to `tests/pages/`.
2. Add API scenarios under `tests/api/`; use Playwright's `request` fixture and assert response status, headers, and payload.
3. Keep test data independent so tests can run in parallel.
4. Run `npm run typecheck` and the relevant test command before pushing.
