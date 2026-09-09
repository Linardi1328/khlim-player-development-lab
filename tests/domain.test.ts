import { describe, expect, it } from "vitest";
import {
  assessmentSchema,
  averageRating,
  goalSchema,
  measurementSchema,
  profileSchema,
  skills,
  today,
  trainingSchema,
} from "../src/lib/domain";
import {
  assertAthleteAccess,
  assertCoach,
  type Viewer,
} from "../src/lib/access";
import {
  digest,
  hashPassword,
  sessionToken,
  verifyPassword,
} from "../src/lib/security";
const ratings = Object.fromEntries(skills.map((s) => [s, 3]));
describe("development validation", () => {
  it("accepts all seven skill ratings and calculates a personal mean", () => {
    const result = assessmentSchema.parse({
      ...ratings,
      assessedAt: today(),
      notes: "Steady footwork under pressure.",
    });
    expect(averageRating(result)).toBe(3);
  });
  it.each([0, 6, 2.5, "", null, false])(
    "rejects invalid rating %s",
    (shooting) => {
      expect(
        assessmentSchema.safeParse({
          ...ratings,
          shooting,
          assessedAt: today(),
          notes: "Some useful notes",
        }).success,
      ).toBe(false);
    },
  );
  it.each(["2026-02-30", "2099-01-01", "invalid"])(
    "rejects invalid or future observation date %s",
    (assessedAt) => {
      expect(
        assessmentSchema.safeParse({
          ...ratings,
          assessedAt,
          notes: "Notes here",
        }).success,
      ).toBe(false);
    },
  );
  it.each([
    ["FREE_THROW", 101],
    ["FIELD_GOAL", -1],
    ["VERTICAL_JUMP", 151],
    ["SPRINT_20M", 0],
    ["SPRINT_20M", 31],
    ["FIELD_GOAL", ""],
  ])("rejects metric %s value %s", (metric, value) => {
    expect(
      measurementSchema.safeParse({
        metric,
        value,
        measuredAt: today(),
        protocol: "Standard protocol",
      }).success,
    ).toBe(false);
  });
  it("accepts zero made shots and decimal sprint results", () => {
    for (const [metric, value] of [
      ["FREE_THROW", 0],
      ["SPRINT_20M", "4.12"],
    ])
      expect(
        measurementSchema.safeParse({
          metric,
          value,
          measuredAt: today(),
          protocol: "Standard protocol",
        }).success,
      ).toBe(true);
  });
  it("validates profile, goal target and training duration", () => {
    expect(
      profileSchema.safeParse({ name: "A", group: "U18", jerseyNumber: 101 })
        .success,
    ).toBe(false);
    expect(
      goalSchema.safeParse({
        title: "Practice",
        target: "",
        description: "More practice",
        status: "IN_PROGRESS",
        dueDate: today(),
      }).success,
    ).toBe(false);
    expect(
      trainingSchema.safeParse({
        sessionDate: today(),
        type: "SKILL_WORK",
        minutes: 0,
        notes: "Training notes",
      }).success,
    ).toBe(false);
  });
});
describe("access policy", () => {
  const athlete: Viewer = {
    id: "user",
    name: "Synthetic Athlete",
    role: "ATHLETE",
    athleteId: "own",
  };
  const coach: Viewer = { ...athlete, role: "COACH", athleteId: null };
  it("permits self and coach reads", () => {
    expect(() => assertAthleteAccess(athlete, "own")).not.toThrow();
    expect(() => assertAthleteAccess(coach, "other")).not.toThrow();
  });
  it("denies another athlete and unmapped athlete", () => {
    expect(() => assertAthleteAccess(athlete, "other")).toThrow(
      "Athlete not found",
    );
    expect(() =>
      assertAthleteAccess({ ...athlete, athleteId: null }, "own"),
    ).toThrow();
  });
  it("requires coach for mutations", () => {
    expect(() => assertCoach(athlete)).toThrow("Only coaches");
    expect(() => assertCoach(coach)).not.toThrow();
  });
});
describe("lab authentication primitives", () => {
  it("salts hashes, verifies passwords and rejects incorrect credentials", async () => {
    const a = await hashPassword("synthetic-password");
    const b = await hashPassword("synthetic-password");
    expect(a).not.toBe(b);
    expect(await verifyPassword("synthetic-password", a)).toBe(true);
    expect(await verifyPassword("incorrect", a)).toBe(false);
  });
  it("generates unique opaque tokens stored as digests", () => {
    const token = sessionToken();
    expect(token).toHaveLength(64);
    expect(digest(token)).not.toBe(token);
    expect(sessionToken()).not.toBe(token);
  });
});
