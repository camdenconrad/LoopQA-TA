import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import testCases from './data/testData.json';

/**
 * Data-driven regression suite for task board validation.
 * Test cases are defined in testData.json — no code changes needed to add scenarios.
 */
test.describe('Login Automation', () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Web Application', level: 1, exact: true })).toBeVisible();
  });

  for (const tc of testCases) {

    test(`${tc.id} - ${tc.board}: "${tc.task}" is in ${tc.column} with correct tags`, async ({ page }) => {

      // Sidebar items include subtitle text in their accessible name, so omit exact: true.
      await page.getByRole('button', { name: tc.board }).click();
      await expect(page.getByRole('heading', { name: tc.board, level: 1, exact: true })).toBeVisible();

      // Column headings include a task count suffix ("To Do (2)"), so omit exact: true.
      // `:has(> h2)` limits to elements where h2 is a direct child, excluding ancestor wrappers.
      const column = page.locator(':has(> h2)').filter({
        has: page.getByRole('heading', { level: 2, name: tc.column }),
      });
      await expect(column).toBeVisible();

      // Scoped to `column` so a same-named task in another column can't satisfy this locator.
      const taskCard = column.locator(':has(> h3)').filter({
        has: page.getByRole('heading', { level: 3, name: tc.task, exact: true }),
      });
      await expect(taskCard).toBeVisible();

      for (const tag of tc.tags) {
        await expect(taskCard.getByText(tag, { exact: true })).toBeVisible();
      }

    });
  }

});
