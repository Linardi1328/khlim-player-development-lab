import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { login, noOverflow } from "./helpers";
import { today } from "../src/lib/domain";
test("coach creates a complete development journey through the UI", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await login(page);
  await expect(
    page.getByRole("heading", { name: "Every practice counts." }),
  ).toBeVisible();
  await noOverflow(page);
  await page.getByRole("link", { name: "Add athlete", exact: true }).click();
  const name = `UI Synthetic ${info.project.name} ${Date.now()}`;
  await page.getByLabel("Athlete name").fill(name);
  await page.getByLabel("Development group").selectOption("U12");
  await page.getByLabel("Jersey number").fill("16");
  await page.getByLabel("Playing position").selectOption("Guard");
  await page
    .getByLabel("Current development focus")
    .fill("Build control and balance at the rim.");
  await page.getByRole("button", { name: "Create athlete" }).click();
  await expect(page.getByRole("heading", { name, exact: true })).toBeVisible();
  await expect(page.getByText("Let’s find the starting point")).toBeVisible();
  const profileUrl = page.url().split("?")[0];
  await page
    .getByRole("link", { name: "New check-in", exact: true })
    .first()
    .click();
  await page.getByLabel("Assessment date").fill("2026-02-01");
  await page.getByLabel("Shooting", { exact: true }).selectOption("2");
  await page
    .getByLabel("Assessment notes")
    .fill("Baseline: steady footwork with room to improve balance.");
  await page.getByRole("button", { name: "Save assessment" }).click();
  await expect(
    page.getByText("Baseline: steady footwork with room to improve balance."),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Record assessment", exact: true })
    .click();
  await page.getByLabel("Shooting", { exact: true }).selectOption("4");
  await page
    .getByLabel("Assessment notes")
    .fill("More consistent balance and follow-through today.");
  await page.getByRole("button", { name: "Save assessment" }).click();
  await expect(page.locator("details")).toHaveCount(2);
  await page.getByRole("link", { name: "Measurements", exact: true }).click();
  await page
    .getByRole("link", { name: "Record measurement", exact: true })
    .first()
    .click();
  await page.getByLabel("Metric", { exact: true }).selectOption("SPRINT_20M");
  await expect(page.getByLabel("Result (s)")).toBeVisible();
  await page.getByLabel("Result (s)").fill("4.21");
  await page
    .getByLabel("Measurement protocol")
    .fill("Standing start, 20 metres, hand timed; best of three.");
  await page.getByRole("button", { name: "Save measurement" }).click();
  await expect(
    page.getByRole("img", { name: /20 m sprint history/ }),
  ).toBeVisible();
  await page.getByRole("link", { name: /^Goals/ }).click();
  await page.getByRole("link", { name: "Create goal", exact: true }).click();
  await page.getByLabel("Goal title").fill("Control the final two steps");
  await page.getByLabel("Due date").fill(today());
  await page.getByLabel("Success target").fill("Make 8 of 10 off-hand layups.");
  await page
    .getByLabel("Practice plan")
    .fill("Practice five deliberate repetitions per side.");
  await page.getByRole("button", { name: "Save goal" }).click();
  await page.getByLabel("Goal status").selectOption("COMPLETED");
  await page.getByRole("button", { name: "Update", exact: true }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Saved" }).last(),
  ).toBeVisible();
  await expect(page.locator(".goal-card .badge").first()).toHaveText(
    "Completed",
  );
  await page.getByRole("link", { name: "Training", exact: true }).click();
  await page.getByRole("link", { name: "Record session", exact: true }).click();
  await page
    .getByLabel("Session notes")
    .fill("Controlled finishing and change-of-pace ball handling.");
  await page.getByRole("button", { name: "Save training session" }).click();
  await expect(
    page.getByText("Controlled finishing and change-of-pace ball handling."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Feedback", exact: true }).click();
  await page
    .getByRole("link", { name: "Add feedback", exact: true })
    .first()
    .click();
  await page
    .getByLabel("Feedback for the athlete")
    .fill("Your controlled final step is improving. Keep the same rhythm.");
  await page.getByRole("button", { name: "Save coach feedback" }).click();
  await expect(
    page.getByText(
      "Your controlled final step is improving. Keep the same rhythm.",
    ),
  ).toBeVisible();
  await page.getByRole("link", { name: "Edit profile", exact: true }).click();
  await page
    .getByLabel("Current development focus")
    .fill("Carry the controlled finish into small-sided games.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(
    page.getByText("Carry the controlled finish into small-sided games."),
  ).toBeVisible();
  await page.goto(profileUrl);
  await expect(
    page.getByRole("img", {
      name: /Personal skill development over time. 2 recorded check-ins/,
    }),
  ).toBeVisible();
  await expect(page.getByText("4.21", { exact: false }).first()).toBeVisible();
  await noOverflow(page);
  await page.screenshot({
    path: `artifacts/e2e-${info.project.name}-profile.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
});
test("athlete can browse only their own history on every viewport", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await login(page, "athlete1");
  await expect(
    page.getByRole("heading", { name: "Avery Tan", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit profile" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "New check-in" })).toHaveCount(0);
  await noOverflow(page);
  for (const tab of [
    "Assessments",
    "Measurements",
    "Goals",
    "Training",
    "Feedback",
  ]) {
    await page.getByRole("link", { name: new RegExp(`^${tab}`) }).click();
    await expect(
      page.getByRole("heading", { name: tab, exact: true }),
    ).toBeVisible();
    await noOverflow(page);
  }
  await page.goto("/athletes/00000000-0000-4000-8000-000000000000");
  await expect(
    page.getByRole("heading", { name: "This page isn’t available." }),
  ).toBeVisible();
  await page.goto("/athletes/new");
  await expect(
    page.getByRole("heading", { name: "This page isn’t available." }),
  ).toBeVisible();
  await page.goto("/");
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome to the lab." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("roster filtering, empty results and keyboard navigation", async ({
  page,
}) => {
  await login(page);
  await page.getByRole("link", { name: "Athlete roster", exact: true }).click();
  await page.getByLabel("Development group").selectOption("U9");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".athlete-card")).toHaveCount(4);
  await page
    .getByLabel("Search athletes")
    .fill("No matching synthetic athlete");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByText("No athletes found")).toBeVisible();
  await noOverflow(page);
  await page.keyboard.press("Control+Home");
  await page.goto("/athletes");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});
test("validation, pending state and connection failure retain the entry", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("Email address").fill("coach1@playerlab.example.test");
  await page.getByLabel("Password", { exact: true }).fill("incorrect");
  await page.getByRole("button", { name: "Sign in to the lab" }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText(
    "Email or password is incorrect",
  );
  await page.getByLabel("Password", { exact: true }).fill("LabPractice!2026");
  await page.getByRole("button", { name: "Sign in to the lab" }).click();
  await expect(
    page.getByRole("heading", { name: "Every practice counts." }),
  ).toBeVisible();
  await page.goto("/athletes/new");
  await page.getByLabel("Athlete name").fill("A");
  await page
    .getByLabel("Current development focus")
    .fill("Synthetic validation scenario.");
  await page.getByRole("button", { name: "Create athlete" }).click();
  await expect(page.locator(".form-error[role=alert]")).toContainText(
    "Check the highlighted fields",
  );
  await expect(page.getByLabel("Athlete name")).toBeFocused();
  await page.getByLabel("Athlete name").fill("Network Recovery Synthetic");
  let release: () => void = () => {};
  const hold = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/athletes", async (route) => {
    await hold;
    await route.abort("failed");
  });
  await page.getByRole("button", { name: "Create athlete" }).click();
  await expect(page.getByRole("button", { name: "Saving…" })).toBeDisabled();
  release();
  await expect(page.locator(".form-error[role=alert]")).toContainText(
    "Connection interrupted",
  );
  await expect(page.getByLabel("Athlete name")).toHaveValue(
    "Network Recovery Synthetic",
  );
  await noOverflow(page);
});
test("key screens meet automated accessibility checks", async ({ page }) => {
  await page.goto("/login");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
  await login(page);
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
  await page.goto("/athletes");
  await page.locator(".athlete-card").filter({ hasText: "Avery Tan" }).click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  ).toEqual([]);
});
