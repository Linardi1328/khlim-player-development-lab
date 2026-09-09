import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Remove only machine-named, unlinked fixtures from this test suite.
// Seeded athletes and manual browser-review records are never selected.
export default async function cleanup() {
  const url = new URL(process.env.DATABASE_URL!);
  if (
    !url.pathname.slice(1).startsWith("khlim_player_lab") ||
    !["127.0.0.1", "localhost", "db"].includes(url.hostname)
  )
    throw new Error("Test cleanup requires an isolated local lab database.");
  const db = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  try {
    const candidates = await db.athlete.findMany({
      where: {
        userId: null,
        OR: [
          { name: { startsWith: "UI Synthetic " } },
          { name: { startsWith: "API Synthetic " } },
        ],
      },
      select: { id: true, name: true },
    });
    const ids = candidates
      .filter((a) =>
        /^(UI Synthetic (desktop|phone|tablet) \d{13}|API Synthetic \d{13} Edited)$/.test(
          a.name,
        ),
      )
      .map((a) => a.id);
    await db.$transaction(async (tx) => {
      const where = { athleteId: { in: ids } };
      await tx.coachFeedback.deleteMany({ where });
      await tx.trainingSession.deleteMany({ where });
      await tx.developmentGoal.deleteMany({ where });
      await tx.athleteMeasurement.deleteMany({ where });
      await tx.developmentAssessment.deleteMany({ where });
      await tx.athlete.deleteMany({ where: { id: { in: ids }, userId: null } });
    });
  } finally {
    await db.$disconnect();
  }
}
