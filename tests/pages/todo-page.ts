import type { Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.todoList = page.getByRole('list').first();
  }

  async goto() {
    await this.page.goto('', { waitUntil: 'domcontentloaded' });
    await this.newTodoInput.waitFor({ state: 'visible' });
  }

  async addTodo(title: string) {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  todoRow(title: string) {
    return this.todoList.getByRole('listitem').filter({ hasText: title });
  }

  async completeTodo(title: string) {
    await this.todoRow(title).getByRole('checkbox').check();
  }

  async deleteTodo(title: string) {
    const row = this.todoRow(title);
    await row.hover();
    await row.getByRole('button', { name: 'Delete' }).click();
  }

  async showTodos(filter: 'All' | 'Active' | 'Completed') {
    await this.page.getByRole('link', { name: filter, exact: true }).click();
  }
}
