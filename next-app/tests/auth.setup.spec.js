import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto("http://localhost:3000/user/signin");
  await page.getByLabel("Email address").fill("michalsroka04@gmail.com");
  await page.getByLabel("Password").fill("zaq1@WSX");
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL("http://localhost:3000/user/profileView");
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  await expect(
    page.getByRole("button", { name: "Edit Profile" })
  ).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
