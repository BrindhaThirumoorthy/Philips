import { test, expect } from '@playwright/test';
import { baseUrl } from '../Variables/data';

test('has title', async ({ page }) => {

  await page.goto(baseUrl);
  await page.waitForTimeout(1000);


});

