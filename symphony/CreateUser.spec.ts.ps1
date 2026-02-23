$Env:REPORT_PATH="E:\Playwright\playwright-report\b790680a-3c91-409d-9577-10e11e5e3146"
$Env:OUTPUT_PATH="E:\Playwright\playwright-report"
$Env:SCREENSHOT_PATH="E:\Playwright\screenshotDir"
$Env:REPORT_FORMATS="html,json"
Set-Location "E:\Playwright"
& npx playwright test "CreateUser.spec.ts" --headed --project "Google Chrome" -g "Philips Instance" --workers=1 --repeat-each=1 