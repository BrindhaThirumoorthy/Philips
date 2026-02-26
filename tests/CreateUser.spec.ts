import { test, expect, Page } from '@playwright/test';
import { baseUrl, email, fullName, NewUser, passWord, userName, partition } from '../Variables/data';
 
type RolesPerPartition = Record<string, string[]>;
 
const PARTITIONS_TO_SELECT = partition.split(',').map((p) => p.trim());
const DEFAULT_PARTITION = PARTITIONS_TO_SELECT[0];
 
async function createNewUser(
  page: Page,
  rolesPerPartition: RolesPerPartition,
  username: string,
  options?: {
    fullName?: string;
    email?: string;
    password?: string;
    partitions?: string[];
    defaultPartition?: string;
  }
): Promise<void> {
  const fullNameVal = options?.fullName ?? 'Automation Test User';
  const emailVal = options?.email ?? `${username}@test.com`;
  const passwordVal = options?.password ?? 'Test@12345';
  const partitions = options?.partitions ?? PARTITIONS_TO_SELECT;
  const defaultPartition = options?.defaultPartition ?? DEFAULT_PARTITION;
 
  await page.locator('#addEditUser_form').waitFor({ state: 'visible' });
 
  await page.locator('#addEditUser_form_userName').fill(username);
  await page.locator('#addEditUser_form_fullName').fill(fullNameVal);
  await page.locator('#addEditUser_form_email').fill(emailVal);
  await page.locator('#addEditUser_form_password').fill(passwordVal);
  await page.locator('#addEditUser_form_confirmPassword').fill(passwordVal);
 
  const activeCheckbox = page.locator('#addEditUser_form_userIsActive');
  if (!(await activeCheckbox.isChecked())) {
    await activeCheckbox.check();
  }
 
  for (const partition of partitions) {
    const selectedChip = page
      .locator('#addEditUser_form_partitions')
      .getByText(partition, { exact: true });
    if (await selectedChip.isVisible()) {
      continue;
    }
    await page.locator('#partitions_selector').click();
    await page.getByRole('option', {
      name: new RegExp(`^${partition}$`),
    }).click();
    await page.keyboard.press('Escape');
  }
 
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
 
  await page.waitForSelector('[data-testid^="partitionRoles_"]', {
    timeout: 15000,
  });
 
  const defaultSelected = page
    .locator('#addEditUser_form_defaultPartition')
    .getByText(defaultPartition, { exact: true });
  if (!(await defaultSelected.isVisible())) {
    await page.locator('#defaultPartition_selector').click();
    await page.getByRole('option', {
      name: new RegExp(`^${defaultPartition}$`),
    }).click();
  }
 
  const roleSections = page.locator('[data-testid^="partitionRoles_"]');
  const count = await roleSections.count();
  for (let i = 0; i < count; i++) {
    const rolesContainer = roleSections.nth(i);
    const roleInput = rolesContainer.locator('input[role="combobox"]');
    const selectedRoles = rolesContainer.locator('.vtx-multi-select__multi-value');
    if ((await selectedRoles.count()) > 0) continue;
 
    await roleInput.waitFor({ state: 'visible', timeout: 15000 });
    await roleInput.click();
    const firstRoleOption = page.locator('[role="option"]').first();
    await firstRoleOption.waitFor({ state: 'visible', timeout: 15000 });
    await firstRoleOption.click();
    await page.keyboard.press('Escape');
  }
 
  const pwd = await page.locator('#addEditUser_form_password').inputValue();
  const confirmPwd = await page.locator('#addEditUser_form_confirmPassword').inputValue();
  expect(pwd, 'Password and Confirm Password must match').toBe(confirmPwd);
 
  await expect(page.getByTestId('user-save-button')).toBeEnabled();
  await page.getByTestId('user-save-button').click();
 
  await expect(page.getByTestId('page-heading')).toHaveText('Users', { timeout: 15000 });
}
 
async function ensureUserExists(page: Page, username: string): Promise<void> {
  await page.getByTestId('username-email-search-input').fill(username);
  await page.getByRole('button', { name: 'user name or email search' }).click();
 
  const userRows = page.locator('#vtx_users_table tbody tr[data-row-key]');
  const emptyState = page.locator('#vtx_users_table_empty');
 
  await Promise.race([
    userRows.first().waitFor({ state: 'visible', timeout: 15000 }),
    emptyState.waitFor({ state: 'visible', timeout: 15000 }),
  ]);
 
  if ((await userRows.count()) > 0) {
    console.log(`**gbStart**output**splitKeyValue**User is Already Exist: ${NewUser}\n **gbEnd**`);
 
    const row = page.locator('#vtx_users_table tbody tr[data-row-key]').filter({
      has: page.getByRole('link', { name: NewUser }),
    });
    await row.first().waitFor({ state: 'visible' });
    const emailFromTable = await row.first().locator('td.minWidth-90').innerText();
    console.log(`**gbStart**emailId**splitKeyValue**${emailFromTable}**gbEnd**`);
    return;
  }
 
  console.log(`User "${username}" not found. Creating...`);
  await page.getByTestId('add-user-button').click();
 
  await createNewUser(page, { NAM: ['Admin'], ARGDA: ['User'] }, username, {
    fullName: fullName,
    email: email,
    password: passWord,
    partitions: PARTITIONS_TO_SELECT,
    defaultPartition: DEFAULT_PARTITION,
  });
 
  console.log(`User "${username}" created successfully.`);
}
 
test('Philips Instance', async ({ page }) => {
  await page.goto(baseUrl, { timeout: 60_000, waitUntil: 'domcontentloaded' });
 
  await page.fill('input[name="username"], input#username', userName);
  await page.fill('input[name="password"], input#password', passWord);
 
  await page.click('button[type="submit"], input[type="Login_button"]');
 
  await page.waitForLoadState('networkidle');
  await page.locator('[data-testid="system"]').click();
  await page.locator('[data-testid="system/security"]').click();
  await page.locator('[data-testid="system/security/users"]').click();
 
  await expect(page).toHaveURL(/\/system\/security\/users/);
  await page.waitForTimeout(1000);
 
  await page.getByRole('combobox', { name: 'Partition' }).click();
  await page.getByRole('option', { name: 'All Partitions' }).click();
 
  await ensureUserExists(page, NewUser);
  await page.waitForTimeout(10000);
});