import { expect, type APIRequestContext, type Page } from "@playwright/test";
export const origin = "http://127.0.0.1:3000";
export const headers = { origin };
export const password = "LabPractice!2026";
export async function apiLogin(request: APIRequestContext, role = "coach1") {
  const res = await request.post("/api/auth/login", {
    headers,
    data: { email: `${role}@playerlab.example.test`, password },
  });
  expect(res.ok()).toBeTruthy();
  return res.json();
}
export async function login(page: Page, role = "coach1") {
  await page.goto("/login");
  await page.getByLabel("Email address").fill(`${role}@playerlab.example.test`);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in to the lab" }).click();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
}
export async function ownAthlete(request: APIRequestContext) {
  const res = await request.get("/api/athletes?search=Avery%20Tan");
  expect(res.ok()).toBeTruthy();
  return (await res.json())[0];
}
export async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    ),
  ).toBe(true);
}
