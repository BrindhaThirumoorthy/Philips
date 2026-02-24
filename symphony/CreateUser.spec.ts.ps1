$Env:REPORT_PATH="E:\Playwright\playwright-report\4974a89d-6e81-49b7-ae22-7c07ed14a304"
$Env:OUTPUT_PATH="E:\Playwright\playwright-report"
$Env:SCREENSHOT_PATH="E:\Playwright\screenshotDir"
$Env:REPORT_FORMATS="html,json"
Set-Location "E:\Playwright"
& npx playwright test "CreateUser.spec.ts" --headed --project "Google Chrome" -g "Philips Instance" --workers=1 --repeat-each=1 