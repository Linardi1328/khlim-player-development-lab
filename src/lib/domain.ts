import { z } from "zod";

export const skills = [
  "shooting",
  "finishing",
  "ballHandling",
  "passing",
  "defense",
  "rebounding",
  "athleticism",
] as const;
export const skillLabels: Record<(typeof skills)[number], string> = {
  shooting: "Shooting",
  finishing: "Finishing",
  ballHandling: "Ball handling",
  passing: "Passing",
  defense: "Defense",
  rebounding: "Rebounding",
  athleticism: "Athleticism",
};
export const metrics = {
  FREE_THROW: {
    label: "Free throws",
    unit: "%",
    min: 0,
    max: 100,
    help: "Made shots ÷ attempts × 100. Record the number of attempts in the protocol.",
    higher: true,
  },
  FIELD_GOAL: {
    label: "Shooting",
    unit: "%",
    min: 0,
    max: 100,
    help: "Made shots ÷ attempts × 100. Use the same locations and number of attempts.",
    higher: true,
  },
  VERTICAL_JUMP: {
    label: "Vertical jump",
    unit: "cm",
    min: 0,
    max: 150,
    help: "Standing vertical jump. Record the method and best of how many attempts.",
    higher: true,
  },
  SPRINT_20M: {
    label: "20 m sprint",
    unit: "s",
    min: 1,
    max: 30,
    help: "Standing start over 20 metres. Record the timing method.",
    higher: false,
  },
} as const;
export const statuses = {
  NOT_STARTED: "Not started",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
} as const;
export const sessionTypes = {
  SKILL_WORK: "Skill work",
  TEAM_PRACTICE: "Team practice",
  STRENGTH_CONDITIONING: "Strength & conditioning",
  GAME_REVIEW: "Game review",
} as const;
export const today = () => new Date().toISOString().slice(0, 10);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a valid date")
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v &&
      v >= "2000-01-01" &&
      v <= "2100-12-31",
    "Choose a valid date between 2000 and 2100",
  );
const pastDate = date.refine(
  (v) => v <= today(),
  "Date cannot be in the future",
);
const text = (max = 2000) =>
  z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters")
    .max(max, `Use ${max} characters or fewer`);
const number = (min: number, max: number) =>
  z
    .union([z.number(), z.string().trim().min(1, "Enter a number")])
    .transform(Number)
    .pipe(z.number().finite().min(min).max(max));
export const profileSchema = z.object({
  name: text(80),
  group: z.enum(["U9", "U12", "U15"]),
  jerseyNumber: number(0, 99).pipe(z.number().int()),
  position: z.enum([
    "Developing all-rounder",
    "Guard",
    "Wing",
    "Forward",
    "Center",
  ]),
  focus: text(240),
});
const rating = number(1, 5).pipe(z.number().int());
export const assessmentSchema = z.object({
  assessedAt: pastDate,
  notes: text(),
  shooting: rating,
  finishing: rating,
  ballHandling: rating,
  passing: rating,
  defense: rating,
  rebounding: rating,
  athleticism: rating,
});
export const measurementSchema = z
  .object({
    metric: z.enum(["FREE_THROW", "FIELD_GOAL", "VERTICAL_JUMP", "SPRINT_20M"]),
    value: number(0, 150),
    measuredAt: pastDate,
    protocol: text(500),
  })
  .superRefine((data, ctx) => {
    const metric = metrics[data.metric];
    if (data.value < metric.min || data.value > metric.max)
      ctx.addIssue({
        code: "custom",
        path: ["value"],
        message: `Enter ${metric.min}–${metric.max} ${metric.unit}`,
      });
  });
export const goalSchema = z.object({
  title: text(100),
  description: text(),
  target: text(240),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
  dueDate: date,
});
export const statusSchema = z.object({
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "COMPLETED"]),
});
export const trainingSchema = z.object({
  sessionDate: pastDate,
  type: z.enum([
    "SKILL_WORK",
    "TEAM_PRACTICE",
    "STRENGTH_CONDITIONING",
    "GAME_REVIEW",
  ]),
  minutes: number(5, 240).pipe(z.number().int()),
  notes: text(),
});
export const feedbackSchema = z.object({ feedback: text() });
export const loginSchema = z.object({
  email: z
    .email()
    .max(254)
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1).max(128),
});
export function averageRating(value: Record<(typeof skills)[number], number>) {
  return skills.reduce((sum, skill) => sum + value[skill], 0) / skills.length;
}
export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}
export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
}
