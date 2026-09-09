import Link from "next/link";
import { notFound } from "next/navigation";
import { pageViewer } from "@/lib/auth";
import { athleteForPage, coachPage } from "@/lib/pages";
import { RecordForm } from "@/components/forms";
const names: Record<string, string> = {
  assessments: "Record an assessment.",
  measurements: "Record a measurement.",
  goals: "Set a development goal.",
  training: "Record a training session.",
  feedback: "Share coach feedback.",
};
export default async function Record({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const viewer = await pageViewer();
  coachPage(viewer);
  const athlete = await athleteForPage(viewer, (await params).id);
  const kind = (await searchParams).type ?? "assessments";
  if (!names[kind]) notFound();
  return (
    <div className="page form-page">
      <Link href={`/athletes/${athlete.id}`} className="text-link">
        ← {athlete.name}
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">
            {athlete.name} · {athlete.group}
          </p>
          <h1>{names[kind]}</h1>
          <p>
            {kind === "assessments"
              ? "A snapshot of today. A reference for tomorrow."
              : "Give the next step a little more clarity."}
          </p>
        </div>
      </div>
      {kind === "assessments" && (
        <div className="rubric">
          <strong>A shared 1–5 scale</strong>
          <p>
            1 Exploring · 2 Developing · 3 Consistent · 4 Confident · 5 Advanced
          </p>
          <span>
            Rate against the athlete’s stage and the same observed drill
            conditions. These are coaching observations, not standardized
            scores.
          </span>
        </div>
      )}
      <div className="panel form-panel">
        <RecordForm athleteId={athlete.id} kind={kind} />
      </div>
    </div>
  );
}
