-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('COACH', 'ATHLETE');

-- CreateEnum
CREATE TYPE "AgeGroup" AS ENUM ('U9', 'U12', 'U15');

-- CreateEnum
CREATE TYPE "Metric" AS ENUM ('FREE_THROW', 'FIELD_GOAL', 'VERTICAL_JUMP', 'SPRINT_20M');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('SKILL_WORK', 'TEAM_PRACTICE', 'STRENGTH_CONDITIONING', 'GAME_REVIEW');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "passwordHash" TEXT,
    "externalAuthId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginThrottle" (
    "key" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "resetAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginThrottle_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Athlete" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "name" TEXT NOT NULL,
    "group" "AgeGroup" NOT NULL,
    "jerseyNumber" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentAssessment" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "assessorId" UUID NOT NULL,
    "assessedAt" DATE NOT NULL,
    "shooting" INTEGER NOT NULL,
    "finishing" INTEGER NOT NULL,
    "ballHandling" INTEGER NOT NULL,
    "passing" INTEGER NOT NULL,
    "defense" INTEGER NOT NULL,
    "rebounding" INTEGER NOT NULL,
    "athleticism" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthleteMeasurement" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "recordedById" UUID NOT NULL,
    "metric" "Metric" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "measuredAt" DATE NOT NULL,
    "protocol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthleteMeasurement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentGoal" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "coachId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "dueDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "DevelopmentGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingSession" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "coachId" UUID NOT NULL,
    "sessionDate" DATE NOT NULL,
    "type" "SessionType" NOT NULL,
    "minutes" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachFeedback" (
    "id" UUID NOT NULL,
    "athleteId" UUID NOT NULL,
    "coachId" UUID NOT NULL,
    "feedback" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_externalAuthId_key" ON "User"("externalAuthId");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Athlete_userId_key" ON "Athlete"("userId");

-- CreateIndex
CREATE INDEX "Athlete_group_name_idx" ON "Athlete"("group", "name");

-- CreateIndex
CREATE INDEX "DevelopmentAssessment_athleteId_assessedAt_createdAt_idx" ON "DevelopmentAssessment"("athleteId", "assessedAt", "createdAt");

-- CreateIndex
CREATE INDEX "AthleteMeasurement_athleteId_metric_measuredAt_createdAt_idx" ON "AthleteMeasurement"("athleteId", "metric", "measuredAt", "createdAt");

-- CreateIndex
CREATE INDEX "DevelopmentGoal_athleteId_status_idx" ON "DevelopmentGoal"("athleteId", "status");

-- CreateIndex
CREATE INDEX "TrainingSession_athleteId_sessionDate_createdAt_idx" ON "TrainingSession"("athleteId", "sessionDate", "createdAt");

-- CreateIndex
CREATE INDEX "CoachFeedback_athleteId_createdAt_idx" ON "CoachFeedback"("athleteId", "createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Athlete" ADD CONSTRAINT "Athlete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentAssessment" ADD CONSTRAINT "DevelopmentAssessment_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentAssessment" ADD CONSTRAINT "DevelopmentAssessment_assessorId_fkey" FOREIGN KEY ("assessorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthleteMeasurement" ADD CONSTRAINT "AthleteMeasurement_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthleteMeasurement" ADD CONSTRAINT "AthleteMeasurement_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentGoal" ADD CONSTRAINT "DevelopmentGoal_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentGoal" ADD CONSTRAINT "DevelopmentGoal_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "CoachFeedback_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachFeedback" ADD CONSTRAINT "CoachFeedback_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Invariants also apply to imports and future clients.
ALTER TABLE "Athlete" ADD CONSTRAINT "athlete_jersey_range" CHECK ("jerseyNumber" BETWEEN 0 AND 99);
ALTER TABLE "DevelopmentAssessment" ADD CONSTRAINT "assessment_ratings_range" CHECK (
  shooting BETWEEN 1 AND 5 AND finishing BETWEEN 1 AND 5 AND "ballHandling" BETWEEN 1 AND 5
  AND passing BETWEEN 1 AND 5 AND defense BETWEEN 1 AND 5 AND rebounding BETWEEN 1 AND 5 AND athleticism BETWEEN 1 AND 5
);
ALTER TABLE "AthleteMeasurement" ADD CONSTRAINT "measurement_value_unit" CHECK (
  (metric IN ('FREE_THROW', 'FIELD_GOAL') AND value BETWEEN 0 AND 100 AND unit = '%') OR
  (metric = 'VERTICAL_JUMP' AND value BETWEEN 0 AND 150 AND unit = 'cm') OR
  (metric = 'SPRINT_20M' AND value BETWEEN 1 AND 30 AND unit = 's')
);
ALTER TABLE "TrainingSession" ADD CONSTRAINT "training_duration_range" CHECK (minutes BETWEEN 5 AND 240);
ALTER TABLE "DevelopmentGoal" ADD CONSTRAINT "goal_completion_consistency" CHECK ((status = 'COMPLETED') = ("completedAt" IS NOT NULL));

-- Fail closed if these tables are exposed through an isolated Supabase Data API.
-- Server-only Prisma uses the owning DB role; no browser Data API policies exist.
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LoginThrottle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Athlete" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DevelopmentAssessment" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AthleteMeasurement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "DevelopmentGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TrainingSession" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CoachFeedback" ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "User", "Session", "LoginThrottle", "Athlete", "DevelopmentAssessment", "AthleteMeasurement", "DevelopmentGoal", "TrainingSession", "CoachFeedback" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "User", "Session", "LoginThrottle", "Athlete", "DevelopmentAssessment", "AthleteMeasurement", "DevelopmentGoal", "TrainingSession", "CoachFeedback" FROM authenticated;
  END IF;
END $$;
