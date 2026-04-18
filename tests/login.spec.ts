import { test, expect } from '@playwright/test';
import { login } from './helpers/login';
import testCases from './data/testData.json';

/**
 * Data-driven regression suite for task board validation.
 *
 * All scenarios are defined in testData.json. Adding a test case requires
 * only a new JSON entry — test coverage scales with the product without
 * increasing maintenance cost.
 */
test.describe('Login Automation', () => {

  // Credentials resolve from environment variables first (CI/CD safe),
  // falling back to tests/data/credentials.json for local runs.
  test.beforeEach(async ({ page }) => {
    await login(page);
    await expect(page.getByRole('heading', { name: 'Web Application', level: 1 })).toBeVisible();
  });

  // Each object in testData.json generates one test — no code changes needed to add cases.
  for (const tc of testCases) {

    test(`${tc.id} - ${tc.board}: "${tc.task}" is in ${tc.column} with correct tags`, async ({ page }) => {

      // Navigate to the target board. Strict role-based selection — Playwright throws
      // on duplicate matches, surfacing regressions immediately.
      await page.getByRole('button', { name: tc.board }).click();
      await expect(page.getByRole('heading', { name: tc.board, level: 1 })).toBeVisible();

      // Scope to the column container. In production, data-testid attributes
      // would be preferred for more deterministic targeting.
      const column = page.locator('div:has(> h2)').filter({ hasText: tc.column });
      await expect(column).toBeVisible();

      // Find the task card within the column — validates placement, not just page presence.
      // In production: column.getByTestId('task-card').filter({ hasText: tc.task })
      const taskCard = column.locator('div:has(> h3)').filter({ hasText: tc.task });
      await expect(taskCard).toBeVisible();

      // Verify each tag. exact: true prevents partial matches (e.g. "Feature" ≠ "Feature Request").
      for (const tag of tc.tags) {
        await expect(taskCard.getByText(tag, { exact: true })).toBeVisible();
      }

    });
  }

});
