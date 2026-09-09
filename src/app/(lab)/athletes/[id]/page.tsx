import Link from "next/link";
import { Check, Pencil, Plus } from "lucide-react";
import { pageViewer } from "@/lib/auth";
import { athleteForPage } from "@/lib/pages";
import { Avatar, Badge } from "@/components/ui";
import {
  Assessments,
  Feedback,
  Goals,
  Measurements,
  Overview,
  Training,
} from "@/components/profile";
const tabs: Record<string, string> = {
  overview: "Overview",
  assessments: "Assessments",
  measurements: "Measurements",
  goals: "Goals",
  training: "Training",
  feedback: "Feedback",
};
const recordLabels: Record<string, string> = {
  assessments: "Record assessment",
  measurements: "Record measurement",
  goals: "Create goal",
  training: "Record session",
  feedback: "Add feedback",
};
export default async function AthletePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; saved?: string }>;
}) {
  const viewer = await pageViewer();
  const athlete = await athleteForPage(viewer, (await params).id);
  const query = await searchParams;
  const tab = tabs[query.tab ?? ""] ? query.tab! : "overview";
  const coach = viewer.role === "COACH";
  const View = {
    overview: Overview,
    assessments: Assessments,
    measurements: Measurements,
    goals: Goals,
    training: Training,
    feedback: Feedback,
  }[tab]!;
  return (
    <div className="page profile-page">
      {coach && (
        <Link className="text-link back-link" href="/athletes">
          ← Athlete roster
        </Link>
      )}
      <div className="profile-heading">
        <Avatar name={athlete.name} large />
        <div className="profile-identity">
          <p className="eyebrow">
            {coach ? "ATHLETE DEVELOPMENT PROFILE" : "YOUR DEVELOPMENT JOURNEY"}
          </p>
          <h1>{athlete.name}</h1>
          <div>
            <Badge>{athlete.group}</Badge>
            <span>{athlete.position}</span>
            <span>#{athlete.jerseyNumber}</span>
          </div>
        </div>
        {coach && (
          <div className="profile-actions">
            <Link
              className="button button-quiet"
              href={`/athletes/${athlete.id}/edit`}
            >
              <Pencil size={15} />
              Edit profile
            </Link>
            <Link
              className="button button-dark"
              href={`/athletes/${athlete.id}/record?type=assessments`}
            >
              <Plus size={16} />
              New check-in
            </Link>
          </div>
        )}
      </div>
      <div className="focus-banner">
        <span className="focus-dot" />
        <span className="eyebrow">CURRENT FOCUS</span>
        <p>{athlete.focus}</p>
      </div>
      {query.saved === "1" && (
        <div className="success-banner" role="status">
          <Check size={18} />
          Saved. Your development profile is up to date.
        </div>
      )}
      <nav className="profile-tabs" aria-label="Development sections">
        {Object.entries(tabs).map(([key, label]) => (
          <Link
            href={`/athletes/${athlete.id}?tab=${key}`}
            key={key}
            className={tab === key ? "active" : ""}
            aria-current={tab === key ? "page" : undefined}
          >
            {label}
            {key === "goals" && (
              <span>
                {athlete.goals.filter((g) => g.status !== "COMPLETED").length}
              </span>
            )}
          </Link>
        ))}
      </nav>
      {tab !== "overview" && (
        <div className="tab-heading">
          <div>
            <h2>{tabs[tab]}</h2>
            <p>
              {
                (
                  {
                    assessments: "Every check-in adds to the story.",
                    measurements: "The numbers behind the practice.",
                    goals: "Clear intentions. Observable progress.",
                    training: "The everyday work that makes a difference.",
                    feedback: "Observations, encouragement and the next step.",
                  } as Record<string, string>
                )[tab]
              }
            </p>
          </div>
          {coach && (
            <Link
              className="button button-dark"
              href={`/athletes/${athlete.id}/record?type=${tab}`}
            >
              <Plus size={16} />
              {recordLabels[tab]}
            </Link>
          )}
        </div>
      )}
      <View athlete={athlete} coach={coach} />
    </div>
  );
}
