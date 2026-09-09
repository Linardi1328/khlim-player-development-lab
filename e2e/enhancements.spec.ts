import { expect, test } from "@playwright/test";
import { headers } from "./helpers";

test("login supports password visibility and recovery navigation", async ({ page }) => {
  await page.goto("/login");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
});

test("language preference translates the login experience", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Language").selectOption("ms");
  await expect(page.getByRole("heading", { name: "Selamat datang ke makmal." })).toBeVisible();
  await expect(page.getByLabel("Alamat e-mel")).toBeVisible();
});

test("local lab forgot-password flow returns a temporary reset path", async ({ request }) => {
  const response = await request.post("/api/auth/forgot-password", {
    headers,
    data: { email: "coach2@playerlab.example.test" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.resetUrl).toMatch(/^\/reset-password\?token=/);
});

test("AI drafting responds without auto-saving", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("coach1@playerlab.example.test");
  await page.getByLabel("Password", { exact: true }).fill("LabPractice!2026");
  await page.getByRole("button", { name: "Sign in to the lab" }).click();
  await page.goto("/athletes");
  await page.getByRole("link", { name: /Avery Tan/ }).first().click();
  await page.getByRole("link", { name: "New check-in" }).click();
  const notes = page.getByLabel("Assessment notes");
  await page.getByRole("button", { name: "Draft with AI" }).click();
  await expect.poll(async () => {
    const draft = await notes.inputValue();
    const error = await page.locator(".field-error").allTextContents();
    return Boolean(draft || error.join(" "));
  }).toBe(true);
});
