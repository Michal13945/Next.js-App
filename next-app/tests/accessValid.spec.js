const { test, expect } = require("@playwright/test");
test("has link do login page", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  // Symulacja kliknięcia na link z tekstem login, przejście do strony logowania
  await page.click("text=Profile");
  // Sprawdzenie, czy została otwarta strona ze ścieżką do formularza logowania
  expect(page).toHaveURL(
    "http://localhost:3000/user/signin?returnUrl=/user/profileView"
  );
  // Sprawdzenie, czy na stronie logowania jest nagłówek z tekstem Login to App
  await expect(page.locator("h1")).toContainText("Sign in");
});