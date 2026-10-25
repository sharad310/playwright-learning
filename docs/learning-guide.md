# Beginner's Guide: Learn Playwright with This Demo

This guide is for testers who are new to Playwright. It uses the files in this repository as examples, so you can read a concept and then find it in the working test code.

## What is Playwright?

Playwright is a browser automation and testing tool. In this project, Playwright Test provides the test runner, browser automation, assertions, fixtures, parallel execution, and reports.

This demo shows two different kinds of testing:

- **UI (end-to-end) testing** opens a browser and checks what a user can see and do in TodoMVC.
- **API testing** sends HTTP requests to JSONPlaceholder and checks the responses without opening a browser.

UI tests are useful for verifying user journeys across the application. API tests are useful for checking service behavior directly and usually run faster.

## Before you start

Install Node.js 20 or newer. From the project root, install dependencies and Playwright's browser binaries:

```sh
npm ci
npx playwright install
```

Run one UI test in Chromium while learning:

```sh
npm run test:chromium -- --grep "adds a todo and starts with an active item"
```

Run the API examples separately:

```sh
npm run test:api
```

`npm test` runs all three UI browser projects and the API project. To see a browser while a UI test runs, use:

```sh
npm run test:chromium -- --headed
```

## Read the project in this order

1. [`package.json`](../package.json) — the available commands and dependencies.
2. [`playwright.config.ts`](../playwright.config.ts) — which tests run in each project and where the demo URLs come from.
3. [`tests/todomvc.spec.ts`](../tests/todomvc.spec.ts) — the UI scenarios and their assertions.
4. [`tests/fixtures/test.ts`](../tests/fixtures/test.ts) — how each UI test receives a ready-to-use TodoMVC page.
5. [`tests/pages/todo-page.ts`](../tests/pages/todo-page.ts) — the page object that wraps common user interactions.
6. [`tests/api/posts.spec.ts`](../tests/api/posts.spec.ts) — how to test HTTP responses without a browser.
7. [`specs/todomvc-test-plan.md`](../specs/todomvc-test-plan.md) — the human-readable scenarios the UI suite covers.
8. [`.github/workflows/playwright.yml`](../.github/workflows/playwright.yml) — how the same checks run on GitHub Actions.

## How a UI test works

Consider the first test in `tests/todomvc.spec.ts`:

```ts
test('adds a todo and starts with an active item', async ({ todoPage }) => {
  const title = 'Buy coffee';

  await todoPage.addTodo(title);

  await expect(todoPage.todoRow(title)).toHaveCount(1);
  await expect(todoPage.newTodoInput).toHaveValue('');
  await expect(todoPage.todoRow(title).getByRole('checkbox')).not.toBeChecked();
  await expect(todoPage.page.getByText('1 item left', { exact: true })).toBeVisible();
});
```

Read it as a short test scenario:

1. Playwright starts the test and supplies its `todoPage` fixture.
2. The test enters a todo title using a helper.
3. The test checks that the row exists, the input cleared, the checkbox is unchecked, and the active-item count is shown.

### `test` and `expect`

`test(...)` defines a scenario. Its callback is `async` because browser actions and assertions may need to wait for the page.

`expect(...)` checks an outcome. Playwright's web assertions, such as `toBeVisible()` and `toHaveCount()`, automatically retry until they pass or time out. This helps avoid fixed sleeps like `waitForTimeout()`.

### Locators

A locator describes how to find an element. This project prefers accessible, user-facing locators:

```ts
page.getByRole('textbox', { name: 'What needs to be done?' });
page.getByRole('button', { name: 'Clear completed' });
```

Role-and-name locators resemble how a user or assistive technology identifies controls. They are generally easier to understand and less fragile than selectors tied to CSS classes or page structure.

When several elements match, narrow the locator to the relevant todo row. For example, the test finds the checkbox inside the row for a specific title instead of checking an arbitrary checkbox.

### Page object and fixture

[`tests/pages/todo-page.ts`](../tests/pages/todo-page.ts) groups TodoMVC locators and actions into `TodoPage`. Methods such as `addTodo()` and `completeTodo()` keep UI mechanics in one place, while the test describes the behavior being checked.

[`tests/fixtures/test.ts`](../tests/fixtures/test.ts) extends Playwright's built-in `test` with a `todoPage` fixture. The fixture creates the page object, opens the app, and gives it to the test. Each test gets a fresh Playwright page and browser context by default, which keeps test state isolated.

The UI test imports `test` and `expect` from this fixture module:

```ts
import { test, expect } from './fixtures/test';
```

The API test imports directly from `@playwright/test`, because it does not need the TodoMVC fixture.

## How an API test works

In `tests/api/posts.spec.ts`, the built-in `request` fixture sends HTTP requests:

```ts
const response = await request.get('/posts/1');

expect(response.status()).toBe(200);
expect(response.headers()['content-type']).toContain('application/json');

const post: Post = await response.json();
expect(post).toMatchObject({
  userId: 1,
  id: 1,
  title: expect.any(String),
  body: expect.any(String),
});
```

The API project in `playwright.config.ts` provides the base URL, so the test can request the relative path `/posts/1`. It then checks the HTTP status, response content type, and important parts of the JSON body.

The `Post` type helps TypeScript understand the expected data shape while you write code. TypeScript types are not runtime validation: the `expect` assertions are what actually check the response received by the test.

Other examples in the same file show:

- Query parameters with `request.get('/posts', { params: { userId: 1 } })`.
- A JSON request body with `request.post('/posts', { data: newPost })`.
- Checking the expected `201 Created` response and returned values.

JSONPlaceholder simulates creating a post; it does not permanently save the example data.

## How the configuration connects everything

[`playwright.config.ts`](../playwright.config.ts) is the test runner's central configuration:

- `testDir` tells Playwright where to discover tests.
- `fullyParallel` allows independent tests to run concurrently.
- `projects` select files and settings for each run:
  - `chromium`, `firefox`, and `webkit` run `tests/todomvc.spec.ts`.
  - `api` runs `tests/api/**/*.spec.ts` and uses the API base URL.
- `BASE_URL` can override the TodoMVC app address; `API_BASE_URL` can override the API address.
- `reporter` creates terminal, HTML, and JUnit results.
- Screenshots, videos, and traces are retained when tests fail to help with debugging.

## Add a small UI test

To practice, add a test in `tests/todomvc.spec.ts` that adds a todo and verifies its text:

```ts
test('shows the title of a newly added todo', async ({ todoPage }) => {
  const title = 'Practice Playwright';

  await todoPage.addTodo(title);

  await expect(todoPage.todoRow(title)).toBeVisible();
});
```

Run it by name:

```sh
npm run test:chromium -- --grep "shows the title"
```

Notice the pattern: arrange the scenario, perform an action, then assert a visible result. The fixture handles navigation, and the page object handles the interaction.

## Add a small API test

Add another test inside `test.describe('Posts API', ...)` in `tests/api/posts.spec.ts`:

```ts
test('returns a not-found status for a missing post', async ({ request }) => {
  const response = await request.get('/posts/999999');

  expect(response.status()).toBe(404);
});
```

Then run:

```sh
npm run test:api -- --grep "missing post"
```

This is an exercise: confirm the demo API's actual response for the selected ID, and adjust the expectation if that service behaves differently.

## Run checks and inspect failures

Before sharing a change, run:

```sh
npm run typecheck
npm test
```

Type-checking catches TypeScript errors. The test run checks behavior in all configured projects. To open the HTML report after a run:

```sh
npm run report
```

For a failing test, first read the assertion and error message. Then use the trace and screenshot in `test-results/`; rerun the scenario in headed or debug mode if you need to watch the browser.

## A few good habits

- Assert behavior a user cares about rather than internal implementation details.
- Prefer role, label, and visible-text locators over brittle CSS selectors.
- Keep each test independent; do not rely on another test's data or execution order.
- Use Playwright's auto-waiting assertions instead of arbitrary pauses.
- Use the UI for user journeys and the API for service-level behavior.
- Never commit passwords, tokens, or saved browser sessions.

Happy testing!
