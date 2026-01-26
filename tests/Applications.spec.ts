import { test, expect } from '@playwright/test';





test('Login and open Java Instances', async ({ page }) => {
    // 1. Go to the application
    await page.goto('https://wdyft60.ssn.philips.com/webdynpro/resources/sap.com/tc~lm~itsam~ui~mainframe~wd/FloorPlanApp?home=true#'); // 👈 replace with actual URL

    // 2. Login
    await page.fill('input[name="j_username"], input#username', 'Administrator');
    await page.fill('input[name="j_password"], input#password', 'Smile@12');
    await page.click('button[type="submit"], input[type="submit"]');

    // Optional: wait for post-login page
    await page.waitForLoadState('networkidle');
    // 3. Search for "instances"
    // Type search text
    const searchBox = page.locator('input[id*="InputField"]');
    await searchBox.fill('instances');

    // Trigger search
    await searchBox.press('Enter');

    // Wait for results
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    // Click Java Instances
    await page.getByText('Java Instances').first().click();
    // await page.locator('//*[@id="CEPJFMAJ.WorkCenterOverviewView._94:0"]').click();
    await page.waitForTimeout(2000);

    // ================================

// SCENARIO 2: Java Applications

// ================================
 
// 1. Click on "Java Applications" tab (3rd tab)

await page

  .locator('span.lsHcnp2__title', { hasText: 'Java Applications' })

  .click();
 
await page.waitForLoadState('networkidle');

await page.waitForTimeout(2000);
 
// 2. Locate Java Applications table

const appTable = page.locator(

  '#CEPJICNK\\.OverviewView\\.ApplicationTable'

);
 
await expect(appTable).toBeVisible();
 


 

 
const appSearchField = page.locator(
  '#CEPJICNK\\.OverviewView\\.ApplicationTable\\:2147483641'
);

async function typeIntoWebDynproField(
  page: any,
  locator: any,
  text: string
) {
  // Focus
  await locator.click();
  await page.waitForTimeout(300);
 
  // Clear existing content
  await page.keyboard.down('Control');
  await page.keyboard.press('KeyA');
  await page.keyboard.up('Control');
  await page.keyboard.press('Backspace');
 
  await page.waitForTimeout(300);
 
  for (const ch of text) {
    if (ch === '*') {
      await page.keyboard.down('Shift');
      await page.keyboard.press('Digit8');
      await page.keyboard.up('Shift');
    } else {
      await page.keyboard.type(ch);
    }
    await page.waitForTimeout(120); 
  }
}

async function searchAndValidate(appText: string) {

  const appSearchField = page.locator(

    '#CEPJICNK\\.OverviewView\\.ApplicationTable\\:2147483641'

  );
 
  await typeIntoWebDynproField(page, appSearchField, appText);
 

  await page.keyboard.press('Enter');
 
  await page.waitForLoadState('networkidle');

  await page.waitForTimeout(2000);
 
  const rows = page.locator(

  '#CEPJICNK\\.OverviewView\\.ApplicationTable tbody tr[rr]'

);
 
const rowCount = await rows.count();
 
if (rowCount === 0) {

  throw new Error('❌ No application rows found');

}
 
let issues: string[] = [];
 
for (let i = 0; i < rowCount; i++) {

  const row = rows.nth(i);
 

  const nameLocator = row.locator('span[ct="TV"]');

  if (!(await nameLocator.count())) continue;
 
  const name = (await nameLocator.first().innerText()).trim();
 
  // Status: Caption (icon + text)

  const statusLocator = row.locator(

    'td[lsdata*="ApplicationTable_Status"] span[ct="CP"]'

  );
 
  if (!(await statusLocator.count())) {

    issues.push(`${name} status not found`);

    continue;

  }
 
  const statusText = (await statusLocator.first().innerText()).trim();
 
  console.log(`App: ${name} | Status: ${statusText}`);
 
  if (statusText !== 'Started') {

    issues.push(`${name} is ${statusText}`);

  }

}
 
if (issues.length > 0) {

  throw new Error(

    '❌ Java Application status validation failed:\n' +

    issues.join('\n')

  );

}
 
console.log('✅ All applications are in Started state');

 
}

 

 

 

 

await searchAndValidate("*inbound*") 
await searchAndValidate("*outbound*") 

console.log('✅ Inbound and Outbound applications are Started');

 
});