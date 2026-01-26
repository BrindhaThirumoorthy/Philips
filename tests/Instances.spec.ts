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

    const javaInstancesTab = page.locator(

        'span.lsHcnp2__title--selected',

        { hasText: 'Java Instances' }

    );

    await expect(javaInstancesTab).toBeVisible();
    // Java Processes table
    const javaProcessTable = page.locator(
        '#CEPJICNK\\.SystemsView\\.J2eeProcessesTable'
    )
    // Get only real Java process rows

const rows = javaProcessTable.locator('tbody tr');

const rowCount = await rows.count();
 
console.log(`Total table rows found (raw): ${rowCount}`);
 
let processCount = 0;

let issues: string[] = [];
 
for (let i = 0; i < rowCount; i++) {

    const row = rows.nth(i);

    const rowText = (await row.innerText()).replace(/\s+/g, ' ').trim();
 
    const match = rowText.match(

        /^(debugproxy|icm|server\d+)\s+.*?\s+(Running|Disabled)\b/i

    );
 
    if (!match) continue;
 
    const name = match[1];

    const status = match[2];
 
    processCount++;

    console.log(`Process: ${name} | Status: ${status}`);
 
    if (name === 'debugproxy') {

        if (status !== 'Disabled') {

            issues.push(`debugproxy is ${status} (expected: Disabled)`);

        }

    } else {

        if (status !== 'Running') {

            issues.push(`${name} is ${status} (expected: Running)`);

        }

    }

}
 
console.log(`Total Java Processes found: ${processCount}`);
 
if (issues.length > 0) {

    throw new Error(

        'Java Process status validation failed:\n' + issues.join('\n')

    );

}
 
});