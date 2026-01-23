import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://businesscoresolutions.com/');
  await page.waitForTimeout(1000);


});

