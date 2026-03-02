$Env:REPORT_PATH="E:\Playwright\playwright-report\01175b87-e49e-4b4c-8f6b-8b722a4406df"
$Env:OUTPUT_PATH="E:\Playwright\playwright-report"
$Env:SCREENSHOT_PATH="E:\Playwright\screenshotDir"
$Env:REPORT_FORMATS="html,json"
Set-Location "E:\Playwright"
& npx playwright test "CreateUser.spec.ts" --headed --project "Google Chrome" -g "Philips Instance" --workers=1 --repeat-each=1 