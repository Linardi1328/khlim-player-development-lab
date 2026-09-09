import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/security";
const url = new URL(process.env.DATABASE_URL!);
if (
  !url.pathname.slice(1).startsWith("khlim_player_lab") ||
  !["127.0.0.1", "localhost", "db"].includes(url.hostname)
)
  throw new Error("Seed is restricted to a local khlim_player_lab database.");
const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});
const names = [
  "Avery Tan",
  "Jordan Lee",
  "Riley Chen",
  "Morgan Park",
  "Casey Wong",
  "Jamie Koh",
  "Taylor Lim",
  "Alex Goh",
  "Quinn Teo",
  "Cameron Low",
  "Drew Ng",
  "Skyler Yeo",
];
const day = (offset: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offset);
  return date;
};
async function seed() {
  const passwordHash = await hashPassword("LabPractice!2026");
  const coaches = await Promise.all(
    ["Maya Brooks", "Eli Rivers"].map((name, i) =>
      db.user.upsert({
        where: { email: `coach${i + 1}@playerlab.example.test` },
        update: {},
        create: {
          name,
          email: `coach${i + 1}@playerlab.example.test`,
          role: "COACH",
          passwordHash,
        },
      }),
    ),
  );
  for (const [i, name] of names.entries()) {
    const email = `athlete${i + 1}@playerlab.example.test`;
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) continue; // Re-running seed preserves all review data and history.
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name, role: "ATHLETE", passwordHash },
      });
      const athlete = await tx.athlete.create({
        data: {
          userId: user.id,
          name,
          group: i < 4 ? "U9" : i < 8 ? "U12" : "U15",
          jerseyNumber: [7, 12, 3, 21, 8, 14, 5, 11, 23, 4, 15, 2][i],
          position:
            i < 4
              ? "Developing all-rounder"
              : ["Guard", "Wing", "Forward", "Center"][i % 4],
          focus: [
            "Build confidence finishing with both hands.",
            "Stay balanced and follow through on every shot.",
            "See the next pass before receiving the ball.",
            "Move your feet and communicate on defense.",
          ][i % 4],
        },
      });
      const coachId = coaches[i % 2].id;
      for (let j = 0; j < 4; j++) {
        const base = Math.min(4, 2 + Math.floor(i / 5) + Math.floor(j / 2));
        await tx.developmentAssessment.create({
          data: {
            athleteId: athlete.id,
            assessorId: coachId,
            assessedAt: day(-105 + j * 30),
            shooting: Math.min(5, base + (j === 3 ? 1 : 0)),
            finishing: base,
            ballHandling: Math.min(5, base + 1),
            passing: base,
            defense: Math.max(1, base - 1 + (j > 1 ? 1 : 0)),
            rebounding: base,
            athleticism: base,
            notes: [
              "Baseline check-in. Comfortable dribbling with the strong hand; building confidence on the other side.",
              "More consistent footwork in close-range shooting. Keep the same pace through the final step.",
              "Good progress finding teammates under pressure. Next focus: balance and control at the rim.",
              "Stronger decisions and a more repeatable shooting routine. Keep working on off-hand finishes at game pace.",
            ][j],
          },
        });
        const values = [
          44 + i + j * 6,
          32 + i + j * 4,
          21 + i * 1.7 + j * 2,
          5.1 - i * 0.07 - j * 0.12,
        ];
        for (const [m, metric] of (
          ["FREE_THROW", "FIELD_GOAL", "VERTICAL_JUMP", "SPRINT_20M"] as const
        ).entries()) {
          await tx.athleteMeasurement.create({
            data: {
              athleteId: athlete.id,
              recordedById: coachId,
              metric,
              value: Number(values[m].toFixed(2)),
              unit: m < 2 ? "%" : m === 2 ? "cm" : "s",
              measuredAt: day(-105 + j * 30),
              protocol: [
                "50 free throws after warm-up; regulation ball for age group.",
                "50 catch-and-shoot attempts from five marked mid-range spots.",
                "Standing countermovement jump, hands on hips; best of three, wall measurement.",
                "Standing start, 20 m indoor court; hand-timed, best of three.",
              ][m],
            },
          });
        }
      }
      for (let j = 0; j < 3; j++) {
        await tx.developmentGoal.create({
          data: {
            athleteId: athlete.id,
            coachId,
            title: [
              "Find a reliable free-throw routine",
              "Finish confidently with either hand",
              "Keep the dribble alive under pressure",
            ][j],
            description: [
              "Practice the same breath, stance and follow-through before every attempt.",
              "Use both sides of the basket, starting slowly and building towards game pace.",
              "Keep your head up and change direction without losing control.",
            ][j],
            target: [
              "Make 35 of 50 free throws in two consecutive check-ins.",
              "Complete 8 of 10 off-hand layups from each side.",
              "Complete the cone course with no more than one lost dribble.",
            ][j],
            status:
              j === 2 ? "COMPLETED" : j === 1 ? "NOT_STARTED" : "IN_PROGRESS",
            dueDate: day(j === 2 ? -20 : 14 + j * 14),
            completedAt: j === 2 ? day(-21) : null,
          },
        });
      }
      for (let j = 0; j < 4; j++)
        await tx.trainingSession.create({
          data: {
            athleteId: athlete.id,
            coachId,
            sessionDate: day(-16 + j * 4 - (i % 3)),
            type: j === 2 ? "TEAM_PRACTICE" : "SKILL_WORK",
            minutes: j === 2 ? 75 : 60,
            notes: [
              "Ball control warm-up, change-of-pace dribbling and close-range finishes.",
              "Footwork stations, form shooting and a 50-shot free-throw check-in.",
              "Small-sided games focusing on spacing, communication and the extra pass.",
              "Off-hand finishing, balanced shooting and controlled one-on-one reps.",
            ][j],
          },
        });
      for (let j = 0; j < 2; j++)
        await tx.coachFeedback.create({
          data: {
            athleteId: athlete.id,
            coachId,
            createdAt: day(-12 + j * 8),
            feedback:
              j === 0
                ? "I noticed you kept looking for the open teammate even when the drill got faster. That patience is a strength. Next time, try calling for the ball before you make your cut."
                : "Your balance at the rim is improving. Keep the final two steps controlled and finish high. For the next session, focus on five quality off-hand reps before adding speed.",
          },
        });
    });
  }
  const counts = await Promise.all([
    db.user.count(),
    db.athlete.count(),
    db.developmentAssessment.count(),
    db.athleteMeasurement.count(),
    db.developmentGoal.count(),
    db.trainingSession.count(),
    db.coachFeedback.count(),
  ]);
  console.log("Synthetic lab seed ready:", {
    users: counts[0],
    athletes: counts[1],
    assessments: counts[2],
    measurements: counts[3],
    goals: counts[4],
    training: counts[5],
    feedback: counts[6],
  });
}
seed().finally(() => db.$disconnect());
