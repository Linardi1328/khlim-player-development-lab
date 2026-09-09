import { expect, test } from "@playwright/test";
import { headers } from "./helpers";

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

test("Malay desktop login keeps intended lines and logo inside its mark", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "desktop typography check");
  await page.goto("/login");
  await page.getByLabel("Language").selectOption("ms");
  await expect(page.locator("html")).toHaveAttribute("lang", "ms");

  const lineCounts = await page
    .locator(".login-message h1")
    .evaluate((heading) => {
      return Array.from(heading.childNodes)
        .filter(
          (node) =>
            node.nodeType === Node.TEXT_NODE || node.nodeName === "SPAN",
        )
        .map((node) => {
          const range = document.createRange();
          range.selectNodeContents(node);
          return range.getClientRects().length;
        });
    });
  expect(lineCounts).toEqual([1, 1, 1]);

  const welcomeLines = await page
    .locator(".login-form-wrap h2")
    .evaluate((heading) => {
      const range = document.createRange();
      range.selectNodeContents(heading);
      return range.getClientRects().length;
    });
  expect(welcomeLines).toBe(1);

  const logoFits = await page
    .locator(".login-story .brand-mark")
    .evaluate((mark) => {
      return (
        mark.scrollWidth <= mark.clientWidth &&
        mark.scrollHeight <= mark.clientHeight
      );
    });
  expect(logoFits).toBe(true);
});

test("every supported login language stays within the viewport", async ({
  page,
}) => {
  await page.goto("/login");
  const language = page.locator(".login-language select");
  for (const locale of ["en", "ms", "zh-CN"] as const) {
    if ((await language.inputValue()) !== locale) {
      const navigation = page.waitForEvent("framenavigated");
      await language.selectOption(locale);
      await navigation;
      await page.waitForLoadState("domcontentloaded");
    }
    await expect(page.locator("html")).toHaveAttribute("lang", locale);
    const viewport = await page.evaluate(() => ({
      scrollHeight: document.documentElement.scrollHeight,
      innerHeight: window.innerHeight,
    }));
    expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight + 1);
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
