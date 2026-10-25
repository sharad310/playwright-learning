import { test as base } from '@playwright/test';
import { TodoPage } from '../pages/todo-page';

type TestFixtures = {
  todoPage: TodoPage;
};

export const test = base.extend<TestFixtures>({
  todoPage: async ({ page }, use) => {
    const todoPage = new TodoPage(page);
    await todoPage.goto();
    await use(todoPage);
  },
});

export { expect } from '@playwright/test';
