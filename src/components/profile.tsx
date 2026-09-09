import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  MessageSquare,
  Target,
} from "lucide-react";
import type { AthleteDetail } from "@/lib/service";
import {
  averageRating,
  formatDate,
  metrics,
  sessionTypes,
  skillLabels,
  skills,
  statuses,
} from "@/lib/domain";
import { Avatar, Badge, Empty, SectionTitle } from "./ui";
import { LineChart } from "./chart";
import { GoalStatusForm } from "./forms";
type Props = { athlete: AthleteDetail; coach: boolean };
const record = (athlete: AthleteDetail, type: string) =>
  `/athletes/${athlete.id}/record?type=${type}`;
export function SkillBars({
  assessment,
}: {
  assessment: AthleteDetail["assessments"][number];
}) {
  return (
    <div className="skill-bars">
      {skills.map((skill) => (
        <div className="skill-row" key={skill}>
          <span>{skillLabels[skill]}</span>
          <div className="skill-track">
            <span style={{ width: `${assessment[skill] * 20}%` }} />
          </div>
          <strong>
            {assessment[skill]}
            <small>/5</small>
          </strong>
        </div>
      ))}
    </div>
  );
}
export function Goals({
  athlete,
  coach,
  compact = false,
}: Props & { compact?: boolean }) {
  const goals = compact
    ? athlete.goals.filter((goal) => goal.status !== "COMPLETED").slice(0, 2)
    : athlete.goals;
  return goals.length ? (
    <div className={compact ? "goal-cards" : "goal-grid"}>
      {goals.map((goal) => (
        <article
          key={goal.id}
          className={`goal-card ${goal.status === "COMPLETED" ? "is-complete" : ""}`}
        >
          <div className="goal-card-heading">
            {goal.status === "COMPLETED" ? (
              <CheckCircle2 size={20} />
            ) : (
              <Target size={20} />
            )}
            <Badge
              tone={
                goal.status === "COMPLETED"
                  ? "green"
                  : goal.status === "IN_PROGRESS"
                    ? "orange"
                    : "neutral"
              }
            >
              {statuses[goal.status]}
            </Badge>
          </div>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
          <div className="goal-target">
            <span>THE TARGET</span>
            <p>{goal.target}</p>
          </div>
          <div className="goal-due">
            <CalendarDays size={14} />
            Due {formatDate(goal.dueDate)}
            {goal.status !== "COMPLETED" &&
              goal.dueDate <
                new Date(new Date().toISOString().slice(0, 10)) && (
                <Badge tone="orange">Review due</Badge>
              )}
          </div>
          {goal.completedAt && (
            <p className="completed-date">
              Completed {formatDate(goal.completedAt)}
            </p>
          )}
          {coach && !compact && (
            <GoalStatusForm id={goal.id} status={goal.status} />
          )}
        </article>
      ))}
    </div>
  ) : (
    <Empty
      title={
        compact
          ? "A fresh space for your next step"
          : "Your next goal starts here"
      }
      href={coach ? record(athlete, "goals") : undefined}
      action="Set a goal"
    >
      {coach
        ? "Create a specific, achievable goal for this athlete."
        : "Your coach will add a clear next step here."}
    </Empty>
  );
}
export function Overview({ athlete, coach }: Props) {
  const current = athlete.assessments[0];
  const history = [...athlete.assessments].reverse();
  const previous = history[0];
  return (
    <>
      <div className="profile-overview-grid">
        <section className="panel padded">
          <SectionTitle
            eyebrow="THE CURRENT PICTURE"
            title="Skill development"
            href={coach ? record(athlete, "assessments") : `?tab=assessments`}
            action={coach ? "New check-in" : "History"}
          />
          {current ? (
            <>
              <div className="assessment-caption">
                <Badge tone="green">Latest check-in</Badge>
                <span>{formatDate(current.assessedAt)}</span>
              </div>
              <SkillBars assessment={current} />
              <p className="scale-note">
                1 Exploring → 5 Advanced · Individual coaching observations
              </p>
            </>
          ) : (
            <Empty
              title="Let’s find the starting point"
              href={coach ? record(athlete, "assessments") : undefined}
              action="Record assessment"
            >
              The first assessment will bring this skill picture to life.
            </Empty>
          )}
        </section>
        <section className="panel padded">
          <SectionTitle eyebrow="THE LONG VIEW" title="Progress over time" />
          {current ? (
            <>
              <div className="chart-summary">
                <strong>
                  {averageRating(current).toFixed(1)}
                  <span>/ 5</span>
                </strong>
                {history.length > 1 && (
                  <Badge tone="green">
                    {averageRating(current) >= averageRating(previous)
                      ? "+"
                      : ""}
                    {(averageRating(current) - averageRating(previous)).toFixed(
                      1,
                    )}{" "}
                    since first check-in
                  </Badge>
                )}
              </div>
              <p className="chart-description">
                Average of this athlete’s seven skill observations
              </p>
              <LineChart
                points={history.map((a) => ({
                  date: a.assessedAt,
                  value: averageRating(a),
                }))}
                label="Personal skill development over time"
                unit="out of 5"
                min={1}
                max={5}
              />
              <Link className="text-link" href="?tab=assessments">
                Explore assessment history
                <ArrowUpRight size={15} />
              </Link>
            </>
          ) : (
            <Empty title="Progress takes a starting point">
              Check-ins will appear here over time.
            </Empty>
          )}
        </section>
      </div>
      <div className="measurement-strip">
        {Object.entries(metrics).map(([key, metric]) => {
          const measurement = athlete.measurements.find(
            (m) => m.metric === key,
          );
          return (
            <Link
              className="measurement-stat"
              key={key}
              href="?tab=measurements"
            >
              <span>
                {metric.label}
                <ArrowUpRight size={14} />
              </span>
              <strong>
                {measurement?.value ?? "—"}
                <small>{metric.unit}</small>
              </strong>
              <p>
                {measurement
                  ? formatDate(measurement.measuredAt)
                  : "No measurement yet"}
              </p>
            </Link>
          );
        })}
      </div>
      <div className="profile-bottom-grid">
        <section>
          <SectionTitle
            eyebrow="PRACTICE WITH PURPOSE"
            title="Goals in motion"
            href="?tab=goals"
            action="All goals"
          />
          <Goals athlete={athlete} coach={coach} compact />
        </section>
        <section>
          <SectionTitle
            eyebrow="FROM THE SIDELINE"
            title="Coach’s corner"
            href="?tab=feedback"
            action="All feedback"
          />
          {athlete.feedback[0] ? (
            <div className="feedback-feature">
              <MessageSquare size={24} />
              <blockquote>{athlete.feedback[0].feedback}</blockquote>
              <div>
                <Avatar name={athlete.feedback[0].coach.name} />
                <span>
                  <strong>{athlete.feedback[0].coach.name}</strong>
                  <small>{formatDate(athlete.feedback[0].createdAt)}</small>
                </span>
              </div>
            </div>
          ) : (
            <Empty title="A conversation about progress">
              Coach feedback will appear here.
            </Empty>
          )}
          <div className="panel mini-training">
            <h3>Last time on the court</h3>
            {athlete.training[0] ? (
              <>
                <p>
                  {sessionTypes[athlete.training[0].type]} ·{" "}
                  {athlete.training[0].minutes} min
                </p>
                <Link className="text-link" href="?tab=training">
                  {formatDate(athlete.training[0].sessionDate)}
                  <ArrowUpRight size={15} />
                </Link>
              </>
            ) : (
              <p>No sessions recorded yet.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
export function Assessments({ athlete, coach }: Props) {
  return athlete.assessments.length ? (
    <div className="history-list">
      {athlete.assessments.map((assessment, i) => (
        <details
          className="panel assessment-history"
          key={assessment.id}
          open={i === 0}
        >
          <summary>
            <div>
              <span className="eyebrow">
                CHECK-IN {athlete.assessments.length - i}
              </span>
              <h3>{formatDate(assessment.assessedAt)}</h3>
              <p>Observed by {assessment.assessor.name}</p>
            </div>
            <Badge tone={i === 0 ? "green" : "neutral"}>
              {i === 0 ? "Current assessment" : "Past assessment"}
            </Badge>
            <span className="expand-label">View details +</span>
          </summary>
          <div className="assessment-detail">
            <SkillBars assessment={assessment} />
            <div>
              <p className="eyebrow">COACH’S OBSERVATIONS</p>
              <p className="preserve-text">{assessment.notes}</p>
            </div>
          </div>
        </details>
      ))}
    </div>
  ) : (
    <Empty
      title="No assessments yet"
      href={coach ? record(athlete, "assessments") : undefined}
      action="Record assessment"
    >
      A first check-in will establish the starting point.
    </Empty>
  );
}
export function Measurements({ athlete, coach }: Props) {
  if (!athlete.measurements.length)
    return (
      <Empty
        title="A baseline is the first step"
        href={coach ? record(athlete, "measurements") : undefined}
        action="Record measurement"
      >
        Add a result and its measurement protocol to begin tracking progress.
      </Empty>
    );
  return (
    <>
      <div className="measurement-charts">
        {Object.entries(metrics).map(([key, metric]) => {
          const records = athlete.measurements.filter((m) => m.metric === key);
          return (
            <section className="panel padded" key={key}>
              <SectionTitle title={`${metric.label} (${metric.unit})`} />
              {records.length ? (
                <>
                  <div className="chart-summary">
                    <strong>
                      {records[0].value}
                      <span>{metric.unit}</span>
                    </strong>
                    <span className="field-help">
                      {metric.higher ? "Higher" : "Lower"} is better under
                      comparable conditions
                    </span>
                  </div>
                  <LineChart
                    points={[...records]
                      .reverse()
                      .map((m) => ({ date: m.measuredAt, value: m.value }))}
                    label={`${metric.label} history`}
                    unit={metric.unit}
                    max={
                      key === "SPRINT_20M"
                        ? Math.max(6, ...records.map((m) => Math.ceil(m.value)))
                        : key === "VERTICAL_JUMP"
                          ? Math.max(
                              60,
                              ...records.map(
                                (m) => Math.ceil(m.value / 10) * 10,
                              ),
                            )
                          : 100
                    }
                  />
                </>
              ) : (
                <p className="muted">No results for this metric yet.</p>
              )}
            </section>
          );
        })}
      </div>
      <SectionTitle title="Measurement history" />
      <p className="section-description">
        Compare results using the same protocol. Shooting percentages use
        percentage points for changes.
      </p>
      <div className="measurement-history">
        {athlete.measurements.map((m) => (
          <article key={m.id} className="panel measurement-entry">
            <div>
              <span className="eyebrow">{formatDate(m.measuredAt)}</span>
              <h3>{metrics[m.metric].label}</h3>
            </div>
            <strong>
              {m.value}
              <small>{m.unit}</small>
            </strong>
            <p>{m.protocol}</p>
          </article>
        ))}
      </div>
    </>
  );
}
export function Training({ athlete, coach }: Props) {
  return athlete.training.length ? (
    <div className="history-list">
      {athlete.training.map((session) => (
        <article key={session.id} className="panel training-entry">
          <span className="session-symbol">
            <CalendarDays size={23} />
          </span>
          <div>
            <div className="entry-heading">
              <h3>{sessionTypes[session.type]}</h3>
              <Badge>{session.minutes} min</Badge>
            </div>
            <p className="entry-meta">
              {formatDate(session.sessionDate)} · {session.coach.name}
            </p>
            <p className="preserve-text">{session.notes}</p>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <Empty
      title="Ready for the next practice"
      href={coach ? record(athlete, "training") : undefined}
      action="Record training session"
    >
      Training notes connect the everyday work with long-term progress.
    </Empty>
  );
}
export function Feedback({ athlete, coach }: Props) {
  return athlete.feedback.length ? (
    <div className="feedback-list">
      {athlete.feedback.map((feedback) => (
        <article className="panel feedback-entry" key={feedback.id}>
          <div>
            <Avatar name={feedback.coach.name} />
            <span>
              <strong>{feedback.coach.name}</strong>
              <small>{formatDate(feedback.createdAt)}</small>
            </span>
            <MessageSquare size={20} />
          </div>
          <p className="preserve-text">{feedback.feedback}</p>
        </article>
      ))}
    </div>
  ) : (
    <Empty
      title="Every effort deserves to be seen"
      href={coach ? record(athlete, "feedback") : undefined}
      action="Add feedback"
    >
      Specific, encouraging coach feedback will live here.
    </Empty>
  );
}
