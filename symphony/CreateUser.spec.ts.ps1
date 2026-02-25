$Env:REPORT_PATH="E:\Playwright\playwright-report\35ea26b9-95da-4575-96c3-1380fdd82a6c"
$Env:OUTPUT_PATH="E:\Playwright\playwright-report"
$Env:SCREENSHOT_PATH="E:\Playwright\screenshotDir"
$Env:REPORT_FORMATS="html,json"
Set-Location "E:\Playwright"
& npx playwright test "CreateUser.spec.ts" --headed --project "Google Chrome" -g "Philips Instance" --workers=1 --repeat-each=1 