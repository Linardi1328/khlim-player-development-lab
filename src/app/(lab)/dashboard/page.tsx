import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Plus,
  Target,
} from "lucide-react";
import { pageViewer } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRoster } from "@/lib/service";
import { formatDate, sessionTypes } from "@/lib/domain";
import {
  Avatar,
  Badge,
  Court,
  Empty,
  SectionTitle,
  Stat,
} from "@/components/ui";
export const metadata = { title: "Coach overview" };
export default async function Dashboard() {
  const viewer = await pageViewer();
  if (viewer.role !== "COACH") redirect(`/athletes/${viewer.athleteId}`);
  const [roster, assessments, goals, training, recent] = await Promise.all([
    getRoster(viewer),
    db.developmentAssessment.count(),
    db.developmentGoal.findMany({
      where: { status: { not: "COMPLETED" } },
      include: { athlete: true },
      orderBy: { dueDate: "asc" },
      take: 4,
    }),
    db.trainingSession.count({
      where: {
        sessionDate: { gte: new Date(new Date().getTime() - 30 * 86400000) },
      },
    }),
    db.trainingSession.findMany({
      include: { athlete: true },
      orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
      take: 4,
    }),
  ]);
  const activeGoals = roster.reduce(
    (sum, a) => sum + a.goals.filter((g) => g.status !== "COMPLETED").length,
    0,
  );
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE BIG PICTURE</p>
          <h1>Every practice counts.</h1>
          <p>
            Welcome back, {viewer.name.split(" ")[0]}. Here’s where development
            stands.
          </p>
        </div>
        <Link className="button button-dark" href="/athletes/new">
          <Plus size={17} />
          Add athlete
        </Link>
      </div>
      <section className="hero">
        <div>
          <Badge tone="lime">THE LONG GAME</Badge>
          <h2>
            See the player.
            <br />
            <span>Build the potential.</span>
          </h2>
          <p>
            Turn small improvements into a clearer picture of every athlete’s
            journey.
          </p>
          <Link className="button button-lime" href="/athletes">
            Explore your roster
            <ArrowRight size={17} />
          </Link>
        </div>
        <Court />
        <span className="hero-caption">EFFORT → CONSISTENCY → PROGRESS</span>
      </section>
      <div className="stats-grid">
        <Stat
          label="Athletes in development"
          value={roster.length.toString().padStart(2, "0")}
          detail="Across U9, U12 and U15"
        />
        <Stat
          label="Development check-ins"
          value={assessments}
          detail="Individual snapshots over time"
        />
        <Stat
          label="Goals in motion"
          value={activeGoals}
          detail="Small steps with a clear purpose"
          accent
        />
        <Stat
          label="Sessions this month"
          value={training}
          detail="Recorded in the last 30 days"
        />
      </div>
      <div className="dashboard-grid">
        <section>
          <SectionTitle
            eyebrow="A PLACE FOR EVERY STAGE"
            title="Your development groups"
            href="/athletes"
            action="Full roster"
          />
          <div className="group-grid">
            {(["U9", "U12", "U15"] as const).map((group, i) => (
              <Link
                href={`/athletes?group=${group}`}
                className={`group-card group-${i}`}
                key={group}
              >
                <div>
                  <span className="group-number">{group}</span>
                  <ArrowUpRight size={20} />
                </div>
                <h3>{["Foundation", "Development", "Performance"][i]}</h3>
                <p>
                  {
                    [
                      "Find the joy. Build the basics.",
                      "Grow skills. Build confidence.",
                      "Refine the details. Own the work.",
                    ][i]
                  }
                </p>
                <span>
                  {roster.filter((a) => a.group === group).length} athletes{" "}
                  <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
          <SectionTitle eyebrow="BACK ON THE COURT" title="Recent training" />
          {recent.length ? (
            <div className="panel activity-list">
              {recent.map((session) => (
                <Link
                  href={`/athletes/${session.athleteId}?tab=training`}
                  key={session.id}
                  className="activity-row"
                >
                  <span className="activity-icon">
                    <CalendarDays size={19} />
                  </span>
                  <div>
                    <strong>{session.athlete.name}</strong>
                    <p>
                      {sessionTypes[session.type]} · {session.minutes} min
                    </p>
                  </div>
                  <time>{formatDate(session.sessionDate)}</time>
                  <ArrowUpRight size={17} />
                </Link>
              ))}
            </div>
          ) : (
            <Empty title="The court is ready">
              Record a session from an athlete’s profile.
            </Empty>
          )}
        </section>
        <section className="panel goal-focus">
          <SectionTitle
            eyebrow="ONE STEP AT A TIME"
            title="Coming into focus"
          />
          {goals.length ? (
            goals.map((goal) => (
              <Link
                className="focus-goal"
                href={`/athletes/${goal.athleteId}?tab=goals`}
                key={goal.id}
              >
                <div>
                  <Avatar name={goal.athlete.name} />
                  <span>
                    {goal.athlete.name}
                    <small>{goal.athlete.group}</small>
                  </span>
                  <Target size={17} />
                </div>
                <h3>{goal.title}</h3>
                <p>Due {formatDate(goal.dueDate)}</p>
              </Link>
            ))
          ) : (
            <Empty title="Room for a new goal">
              Set a specific next step from an athlete profile.
            </Empty>
          )}
          <div className="coach-note">
            <span>COACH’S REMINDER</span>
            <p>
              Progress belongs to the player. Keep the conversation personal.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
