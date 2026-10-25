# TodoMVC Test Plan

**Application:** https://demo.playwright.dev/todomvc/

## Scope

Verify that a user can add todos, mark them complete or active, filter them, and remove them individually or in bulk. Assertions should use the visible todo list and its controls, not implementation details such as CSS classes or persisted storage.

## Preconditions

- Open the TodoMVC demo at the URL above.
- Start each scenario with an empty list. The automated suite uses a fresh browser context for each test.
- Use distinct todo text in each scenario to avoid matching unrelated rows.

## Scenarios

### Add one todo

1. Locate the textbox named **What needs to be done?**.
2. Enter a unique todo title and press Enter.
3. Verify that exactly one matching todo appears in the list.
4. Verify that the textbox is cleared and the new todo is active (not completed).

### Add multiple todos

1. Add two distinct todo titles one at a time using the new-todo textbox and Enter.
2. Verify that both titles appear as separate rows in entry order.
3. Verify that both todos are active and the active-item count reflects two items.

### Ignore whitespace-only todos

1. Enter only whitespace in the new-todo textbox and press Enter.
2. Verify that no todo row is created.

### Complete and reactivate a todo

1. Add a unique todo.
2. In that todo's row, activate its completion checkbox.
3. Verify that the todo is shown as completed and is no longer counted as active.
4. Activate the same checkbox again.
5. Verify that the todo is active again and the active-item count increases accordingly.

### Delete an active todo

1. Add two unique todos.
2. Reveal the delete control for the first todo (hover its row if required) and activate it.
3. Verify that the selected todo is removed and the other todo remains.
4. Verify that the active-item count reflects the remaining todo.

### Filter active and completed todos

1. Add two unique todos and complete one of them.
2. Select **Active** and verify only the active todo is visible.
3. Select **Completed** and verify only the completed todo is visible.
4. Select **All** and verify both todos are visible again.

### Clear completed todos

1. Add two unique todos and complete one of them.
2. Activate **Clear completed**.
3. Verify that the completed todo is removed, the active todo remains, and the active-item count is correct.

### Delete a completed todo

1. Add two unique todos and mark both completed.
2. Select **Completed**.
3. Reveal the delete control for one row (hover if required) and activate it.
4. Verify that the selected todo is removed and the other completed todo remains.

## Test Notes

- Scope checkbox and delete-control locators to the row containing the target todo text so actions cannot affect a neighboring item.
- The delete control may only become visible on hover. Use its accessible name when available; otherwise use a row-scoped locator based on the observed UI and confirm it targets the correct row.
- Keep each scenario independent and clean up via the UI or a fresh context to prevent order-dependent results.