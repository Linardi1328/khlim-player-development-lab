import { z } from "zod";
import { db } from "./db";
import {
  AppError,
  assertAthleteAccess,
  assertCoach,
  type Viewer,
} from "./access";
import {
  assessmentSchema,
  feedbackSchema,
  goalSchema,
  measurementSchema,
  metrics,
  profileSchema,
  statusSchema,
  trainingSchema,
} from "./domain";
const dateOrder = [{ createdAt: "desc" as const }, { id: "desc" as const }];
export async function getRoster(viewer: Viewer, search = "", group = "") {
  assertCoach(viewer);
  return db.athlete.findMany({
    where: {
      name: { contains: search.slice(0, 80), mode: "insensitive" },
      ...(["U9", "U12", "U15"].includes(group)
        ? { group: group as "U9" | "U12" | "U15" }
        : {}),
    },
    include: {
      assessments: { orderBy: [{ assessedAt: "desc" }, ...dateOrder], take: 1 },
      goals: true,
      _count: { select: { training: true } },
    },
    orderBy: { name: "asc" },
  });
}
export async function getAthlete(viewer: Viewer, id: string) {
  assertAthleteAccess(viewer, id);
  if (!z.uuid().safeParse(id).success)
    throw new AppError(404, "Athlete not found.");
  const athlete = await db.athlete.findUnique({
    where: { id },
    include: {
      assessments: {
        include: { assessor: { select: { name: true } } },
        orderBy: [{ assessedAt: "desc" }, ...dateOrder],
      },
      measurements: { orderBy: [{ measuredAt: "desc" }, ...dateOrder] },
      goals: { orderBy: [{ dueDate: "asc" }, ...dateOrder] },
      training: {
        include: { coach: { select: { name: true } } },
        orderBy: [{ sessionDate: "desc" }, ...dateOrder],
      },
      feedback: {
        include: { coach: { select: { name: true } } },
        orderBy: dateOrder,
      },
    },
  });
  if (!athlete) throw new AppError(404, "Athlete not found.");
  return athlete;
}
export async function saveProfile(viewer: Viewer, input: unknown, id?: string) {
  assertCoach(viewer);
  const data = profileSchema.parse(input);
  if (id) {
    await getAthlete(viewer, id);
    return db.athlete.update({ where: { id }, data });
  }
  return db.athlete.create({ data });
}
export async function createRecord(
  viewer: Viewer,
  athleteId: string,
  kind: string,
  input: unknown,
) {
  assertCoach(viewer);
  await getAthlete(viewer, athleteId);
  switch (kind) {
    case "assessments": {
      const value = assessmentSchema.parse(input);
      return db.developmentAssessment.create({
        data: {
          ...value,
          assessedAt: new Date(value.assessedAt),
          athleteId,
          assessorId: viewer.id,
        },
      });
    }
    case "measurements": {
      const value = measurementSchema.parse(input);
      return db.athleteMeasurement.create({
        data: {
          ...value,
          unit: metrics[value.metric].unit,
          measuredAt: new Date(value.measuredAt),
          athleteId,
          recordedById: viewer.id,
        },
      });
    }
    case "goals": {
      const value = goalSchema.parse(input);
      return db.developmentGoal.create({
        data: {
          ...value,
          dueDate: new Date(value.dueDate),
          completedAt: value.status === "COMPLETED" ? new Date() : null,
          athleteId,
          coachId: viewer.id,
        },
      });
    }
    case "training": {
      const value = trainingSchema.parse(input);
      return db.trainingSession.create({
        data: {
          ...value,
          sessionDate: new Date(value.sessionDate),
          athleteId,
          coachId: viewer.id,
        },
      });
    }
    case "feedback":
      return db.coachFeedback.create({
        data: { ...feedbackSchema.parse(input), athleteId, coachId: viewer.id },
      });
    default:
      throw new AppError(404, "Record type not found.");
  }
}
export async function updateGoal(viewer: Viewer, id: string, input: unknown) {
  assertCoach(viewer);
  if (!z.uuid().safeParse(id).success)
    throw new AppError(404, "Goal not found.");
  const { status } = statusSchema.parse(input);
  const goal = await db.developmentGoal.findUnique({ where: { id } });
  if (!goal) throw new AppError(404, "Goal not found.");
  return db.developmentGoal.update({
    where: { id },
    data: {
      status,
      completedAt:
        status === "COMPLETED" ? (goal.completedAt ?? new Date()) : null,
    },
  });
}
export type AthleteDetail = Awaited<ReturnType<typeof getAthlete>>;
