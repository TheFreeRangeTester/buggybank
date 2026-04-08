import { expect, test } from "@playwright/test";

test("login and open dashboard", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill("maria@buggybank.local");
  await page.getByTestId("login-password").fill("Pass1234");
  await page.getByTestId("login-submit").click();

  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText("Saldo total disponible")).toBeVisible();
});

test("transfer flow updates transfer page balances", async ({ page }) => {
  await page.goto("/login");

  await page.getByTestId("login-email").fill("maria@buggybank.local");
  await page.getByTestId("login-password").fill("Pass1234");
  await page.getByTestId("login-submit").click();

  await page.goto("/transfers");
  await page.getByTestId("transfer-amount").fill("25.50");
  await page.getByTestId("transfer-note").fill("Playwright smoke");
  await page.getByTestId("transfer-submit").click();

  await expect(page.getByText(/Transferencia|OK transfer/)).toBeVisible();
});
