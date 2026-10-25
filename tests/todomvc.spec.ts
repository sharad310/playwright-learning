import { test, expect } from './fixtures/test';

test.describe('TodoMVC', () => {
  test('adds a todo and starts with an active item', async ({ todoPage }) => {
    const title = 'Buy coffee';

    await todoPage.addTodo(title);

    await expect(todoPage.todoRow(title)).toHaveCount(1);
    await expect(todoPage.newTodoInput).toHaveValue('');
    await expect(todoPage.todoRow(title).getByRole('checkbox')).not.toBeChecked();
    await expect(todoPage.page.getByText('1 item left', { exact: true })).toBeVisible();
  });

  test('adds multiple todos in order and updates the active count', async ({ todoPage }) => {
    const titles = ['Buy coffee', 'Write report'];

    for (const title of titles) {
      await todoPage.addTodo(title);
    }

    await expect(todoPage.todoList.getByRole('listitem')).toHaveText(titles);
    await expect(todoPage.page.getByText('2 items left', { exact: true })).toBeVisible();
  });

  test('ignores a todo containing only whitespace', async ({ todoPage }) => {
    await todoPage.addTodo('   ');

    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(0);
  });

  test('completes and reactivates a todo with the active count updated', async ({ todoPage }) => {
    const title = 'Review pull request';
    await todoPage.addTodo(title);
    const checkbox = todoPage.todoRow(title).getByRole('checkbox');

    await checkbox.check();
    await expect(checkbox).toBeChecked();
    await expect(todoPage.page.getByText('0 items left', { exact: true })).toBeVisible();

    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
    await expect(todoPage.page.getByText('1 item left', { exact: true })).toBeVisible();
  });

  test('deletes an active todo without affecting another todo', async ({ todoPage }) => {
    const deletedTitle = 'Delete this active todo';
    const remainingTitle = 'Keep this active todo';
    await todoPage.addTodo(deletedTitle);
    await todoPage.addTodo(remainingTitle);

    await todoPage.deleteTodo(deletedTitle);

    await expect(todoPage.todoRow(deletedTitle)).toHaveCount(0);
    await expect(todoPage.todoRow(remainingTitle)).toHaveCount(1);
    await expect(todoPage.page.getByText('1 item left', { exact: true })).toBeVisible();
  });

  test('deletes a completed todo from the completed view', async ({ todoPage }) => {
    const deletedTitle = 'Delete this completed todo';
    const remainingTitle = 'Keep this completed todo';
    await todoPage.addTodo(deletedTitle);
    await todoPage.addTodo(remainingTitle);
    await todoPage.completeTodo(deletedTitle);
    await todoPage.completeTodo(remainingTitle);
    await todoPage.showTodos('Completed');

    await todoPage.deleteTodo(deletedTitle);

    await expect(todoPage.todoRow(deletedTitle)).toHaveCount(0);
    await expect(todoPage.todoRow(remainingTitle)).toHaveCount(1);
  });

  test('filters active and completed todos, then shows all todos again', async ({ todoPage }) => {
    const activeTitle = 'Prepare release notes';
    const completedTitle = 'Review test report';
    await todoPage.addTodo(activeTitle);
    await todoPage.addTodo(completedTitle);
    await todoPage.completeTodo(completedTitle);

    await todoPage.showTodos('Active');
    await expect(todoPage.todoRow(activeTitle)).toBeVisible();
    await expect(todoPage.todoRow(completedTitle)).toBeHidden();

    await todoPage.showTodos('Completed');
    await expect(todoPage.todoRow(completedTitle)).toBeVisible();
    await expect(todoPage.todoRow(activeTitle)).toBeHidden();

    await todoPage.showTodos('All');
    await expect(todoPage.todoRow(activeTitle)).toBeVisible();
    await expect(todoPage.todoRow(completedTitle)).toBeVisible();
  });

  test('clears completed todos while preserving active todos', async ({ todoPage }) => {
    const activeTitle = 'Keep this active todo';
    const completedTitle = 'Clear this completed todo';
    await todoPage.addTodo(activeTitle);
    await todoPage.addTodo(completedTitle);
    await todoPage.completeTodo(completedTitle);

    await todoPage.page.getByRole('button', { name: 'Clear completed' }).click();

    await expect(todoPage.todoRow(completedTitle)).toHaveCount(0);
    await expect(todoPage.todoRow(activeTitle)).toHaveCount(1);
    await expect(todoPage.page.getByText('1 item left', { exact: true })).toBeVisible();
  });
});
