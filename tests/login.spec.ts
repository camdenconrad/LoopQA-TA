import { test, expect } from '@playwright/test';

test.describe('Login Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Username').fill('admin');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    // Wait for the dashboard to load after login
    await expect(page.getByRole('heading', { name: 'Web Application', level: 1 })).toBeVisible();
  });

  test('TC1 - Web Application: "Implement user authentication" is in To Do with correct tags', async ({ page }) => {
    // Navigate to "Web Application" via the sidebar button
    await page.getByRole('button', { name: /Web Application/ }).first().click();

    // Confirm we are on the Web Application board
    await expect(page.getByRole('heading', { name: 'Web Application', level: 1 })).toBeVisible();

    // Find the task card with the correct title
    const taskCard = page.locator('div').filter({ hasText: /^Implement user authentication/ }).first();
    await expect(taskCard).toBeVisible();

    // Verify the task is within the "To Do" column
    const todoColumn = page.locator('div').filter({ hasText: /^To Do/ }).first();
    await expect(todoColumn.locator('text=Implement user authentication')).toBeVisible();

    // Verify "Feature" tag on the card
    await expect(taskCard.getByText('Feature', { exact: true })).toBeVisible();

    // Verify "High Priority" tag on the card
    await expect(taskCard.getByText('High Priority', { exact: true })).toBeVisible();
  });
});
