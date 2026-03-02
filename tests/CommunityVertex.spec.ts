import { test, expect, Page } from '@playwright/test';
import { baseurl,userName,passWord } from '../Variables/vertex';

test('Vertex Community', async ({ page }) => {
  await page.goto(baseurl, {waitUntil: 'domcontentloaded' });
 
await page.getByPlaceholder('Work Email Address').fill(userName);
  await page.getByPlaceholder('Password').fill(passWord);
 
await page.getByRole('button', { name: 'Log in' }).first().click();
await expect(page.getByText(/check your username/i)).toBeVisible();
await page.waitForTimeout(1000);
});