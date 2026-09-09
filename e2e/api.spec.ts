import { test, expect } from "@playwright/test";
import { apiLogin, headers, ownAthlete, password } from "./helpers";
import { today } from "../src/lib/domain";
test("coach HTTP workflow preserves history and constrains all data", async ({
  request,
}) => {
  await apiLogin(request, "coach2");
  const roster = await (await request.get("/api/athletes")).json();
  expect(roster.length).toBeGreaterThanOrEqual(12);
  const create = await request.post("/api/athletes", {
    headers,
    data: {
      name: `API Synthetic ${Date.now()}`,
      group: "U12",
      jerseyNumber: 88,
      position: "Guard",
      focus: "Practice balanced off-hand finishes.",
    },
  });
  expect(create.status()).toBe(201);
  const athlete = await create.json();
  const base = `/api/athletes/${athlete.id}`;
  const a = {
    assessedAt: "2026-01-15",
    shooting: 2,
    finishing: 3,
    ballHandling: 3,
    passing: 2,
    defense: 3,
    rebounding: 2,
    athleticism: 3,
    notes: "Baseline under consistent conditions.",
  };
  expect(
    (await request.post(`${base}/assessments`, { headers, data: a })).status(),
  ).toBe(201);
  expect(
    (
      await request.post(`${base}/assessments`, {
        headers,
        data: {
          ...a,
          assessedAt: today(),
          shooting: 4,
          notes: "More consistent balance and release.",
        },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await request.post(`${base}/measurements`, {
        headers,
        data: {
          metric: "FREE_THROW",
          value: 60,
          unit: "wrong",
          measuredAt: today(),
          protocol: "30 of 50 after warm-up.",
        },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await request.post(`${base}/measurements`, {
        headers,
        data: {
          metric: "FREE_THROW",
          value: 110,
          measuredAt: today(),
          protocol: "50 shots",
        },
      })
    ).status(),
  ).toBe(422);
  expect(
    (
      await request.post(`${base}/assessments`, {
        headers,
        data: { ...a, shooting: 6 },
      })
    ).status(),
  ).toBe(422);
  const goalRes = await request.post(`${base}/goals`, {
    headers,
    data: {
      title: "Improve control",
      description: "Practice five deliberate reps per side.",
      target: "Make 8 of 10 off-hand layups.",
      status: "IN_PROGRESS",
      dueDate: today(),
    },
  });
  expect(goalRes.status()).toBe(201);
  const goal = await goalRes.json();
  const updated = await request.patch(`/api/goals/${goal.id}`, {
    headers,
    data: { status: "COMPLETED" },
  });
  expect(updated.ok()).toBeTruthy();
  expect((await updated.json()).completedAt).toBeTruthy();
  expect(
    (
      await request.post(`${base}/training`, {
        headers,
        data: {
          sessionDate: today(),
          type: "SKILL_WORK",
          minutes: 60,
          notes: "Worked on balance and controlled finishing.",
        },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await request.post(`${base}/feedback`, {
        headers,
        data: {
          feedback: "Good patience on your final step. Keep that rhythm.",
        },
      })
    ).status(),
  ).toBe(201);
  expect(
    (
      await request.patch(base, {
        headers,
        data: {
          name: athlete.name + " Edited",
          group: "U15",
          jerseyNumber: 9,
          position: "Wing",
          focus: "Build consistency at game pace.",
          userId: "malicious",
          role: "COACH",
        },
      })
    ).ok(),
  ).toBeTruthy();
  const detail = await (await request.get(base)).json();
  expect(detail.assessments).toHaveLength(2);
  expect(detail.assessments[0].shooting).toBe(4);
  expect(detail.assessments[1].shooting).toBe(2);
  expect(detail.measurements[0].unit).toBe("%");
  expect(detail.goals[0].status).toBe("COMPLETED");
  expect(detail.training).toHaveLength(1);
  expect(detail.feedback).toHaveLength(1);
  expect(detail.userId).toBeNull();
});
test("athlete cannot read another athlete or invoke any coach operation", async ({
  request,
  browser,
}) => {
  await apiLogin(request);
  const avery = await ownAthlete(request);
  const all = await (await request.get("/api/athletes")).json();
  const other = all.find((a: { id: string }) => a.id !== avery.id);
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
  });
  const athleteRequest = context.request;
  const signIn = await apiLogin(athleteRequest, "athlete1");
  expect(signIn.redirect).toBe(`/athletes/${avery.id}`);
  const own = await athleteRequest.get(`/api/athletes/${avery.id}`);
  expect(own.status()).toBe(200);
  const data = await own.json();
  expect(data.assessments.length).toBeGreaterThanOrEqual(4);
  expect(data.measurements.length).toBeGreaterThanOrEqual(16);
  expect(JSON.stringify(data)).not.toContain("passwordHash");
  expect((await athleteRequest.get("/api/athletes")).status()).toBe(403);
  const forbidden = await athleteRequest.get(`/api/athletes/${other.id}`);
  expect(forbidden.status()).toBe(404);
  expect(await forbidden.text()).not.toContain(other.name);
  expect(
    (
      await athleteRequest.post("/api/athletes", { headers, data: {} })
    ).status(),
  ).toBe(403);
  for (const id of [avery.id, other.id]) {
    expect(
      (
        await athleteRequest.patch(`/api/athletes/${id}`, { headers, data: {} })
      ).status(),
    ).toBe(403);
    for (const kind of [
      "assessments",
      "measurements",
      "goals",
      "training",
      "feedback",
    ])
      expect(
        (
          await athleteRequest.post(`/api/athletes/${id}/${kind}`, {
            headers,
            data: {},
          })
        ).status(),
      ).toBe(403);
  }
  expect(
    (
      await athleteRequest.patch(`/api/goals/${data.goals[0].id}`, {
        headers,
        data: { status: "COMPLETED" },
      })
    ).status(),
  ).toBe(403);
  await context.close();
});
test("unauthenticated, invalid, forged-origin and revoked sessions fail closed", async ({
  request,
}) => {
  expect((await request.get("/api/athletes")).status()).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email: "coach1@playerlab.example.test", password: "incorrect" },
      })
    ).status(),
  ).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", {
        headers: { origin: "https://untrusted.example" },
        data: { email: "coach1@playerlab.example.test", password },
      })
    ).status(),
  ).toBe(403);
  await apiLogin(request);
  expect(
    (
      await request.post("/api/athletes", {
        headers: { origin: "https://untrusted.example" },
        data: {},
      })
    ).status(),
  ).toBe(403);
  const state = await request.storageState();
  const cookie = state.cookies.find((c) => c.name === "khlim_lab_session")!;
  expect(cookie.httpOnly).toBe(true);
  expect(cookie.sameSite).toBe("Lax");
  await request.post("/api/auth/logout", { headers, data: {} });
  expect(
    (
      await request.get("/api/athletes", {
        headers: { cookie: `${cookie.name}=${cookie.value}` },
      })
    ).status(),
  ).toBe(401);
});
test("repeated failed sign-ins are throttled without revealing accounts", async ({
  request,
}) => {
  const email = `unknown-${Date.now()}@playerlab.example.test`;
  for (let i = 0; i < 10; i++)
    expect(
      (
        await request.post("/api/auth/login", {
          headers,
          data: { email, password: "incorrect" },
        })
      ).status(),
    ).toBe(401);
  expect(
    (
      await request.post("/api/auth/login", {
        headers,
        data: { email, password: "incorrect" },
      })
    ).status(),
  ).toBe(429);
});
