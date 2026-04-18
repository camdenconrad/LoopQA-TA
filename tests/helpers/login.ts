import { Page } from '@playwright/test';
import defaultCredentials from '../data/credentials.json';

/**
 * Reusable login helper consumed by beforeEach across the suite.
 *
 * Credentials resolve in order:
 *   1. Environment variables (TEST_USER / TEST_PASS) — for CI/CD pipelines
 *   2. tests/data/credentials.json — committed defaults for local and demo runs
 */
export async function login(page: Page): Promise<void> {
  const username = process.env.TEST_USER ?? defaultCredentials.username;
  const password = process.env.TEST_PASS ?? defaultCredentials.password;

  await page.goto('/');
  await page.getByLabel('Username').fill(username);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}
