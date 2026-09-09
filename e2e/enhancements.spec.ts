import { expect, test } from "@playwright/test";
import { headers, login } from "./helpers";

test("login supports password visibility and recovery navigation", async ({
  page,
}) => {
  await page.goto("/login");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("link", { name: "Forgot password?" }).click();
  await expect(
    page.getByRole("heading", { name: "Reset your password" }),
  ).toBeVisible();
});

test("language preference translates the login experience", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Language").selectOption("ms");
  await expect(
    page.getByRole("heading", { name: "Selamat datang ke makmal." }),
  ).toBeVisible();
  await expect(page.getByLabel("Alamat e-mel")).toBeVisible();
});

test("every supported login language stays within the viewport", async ({
  page,
}) => {
  await page.goto("/login");
  const language = page.getByLabel("Language");
  for (const locale of ["en", "ms", "zh-CN"]) {
    await language.selectOption(locale);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            document.documentElement.scrollHeight <= window.innerHeight + 1,
        ),
      )
      .toBe(true);
  }
});

test("local lab forgot-password flow returns a temporary reset path", async ({
  request,
}) => {
  const response = await request.post("/api/auth/forgot-password", {
    headers,
    data: { email: "coach2@playerlab.example.test" },
  });
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(body.resetUrl).toMatch(/^\/reset-password\?token=/);
});

test("AI draft action responds without saving the assessment", async ({
  page,
}) => {
  await login(page, "coach1");
  await page.goto("/athletes");
  await page
    .getByRole("link", { name: /Avery Tan/ })
    .first()
    .click();
  await page.getByRole("link", { name: "New check-in" }).first().click();
  await expect(page).toHaveURL(/\/record\?type=assessments$/);
  const notes = page.getByLabel("Assessment notes");
  await expect(notes).toBeVisible();
  const recordUrl = page.url();
  await page.getByRole("button", { name: "Draft with AI" }).click();
  await expect
    .poll(async () => {
      const draft = await notes.inputValue();
      const error = await page.locator(".field-error").allTextContents();
      return Boolean(draft || error.join(" "));
    })
    .toBe(true);
  expect(page.url()).toBe(recordUrl);
  await expect(
    page.getByRole("button", { name: "Save assessment" }),
  ).toBeVisible();
});
