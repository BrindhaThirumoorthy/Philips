$Env:REPORT_PATH="E:\Playwright\playwright-report\93401504-3646-4c68-8e88-e3772ae3a77a"
$Env:OUTPUT_PATH="E:\Playwright\playwright-report"
$Env:SCREENSHOT_PATH="E:\Playwright\screenshotDir"
$Env:REPORT_FORMATS="html,json"
Set-Location "E:\Playwright"
& npx playwright test "CreateUser.spec.ts" --headed --project "Google Chrome" -g "Philips Instance" --workers=1 --repeat-each=1 