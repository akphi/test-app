import { test, expect } from "@playwright/test";
// import { username, password } from "./helper";

test("example", async ({ page }) => {
  await page.goto('http://localhost:3000/studio');
  await page.locator('text=Setup Workspace').click();
});
