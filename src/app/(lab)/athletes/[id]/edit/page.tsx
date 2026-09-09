import Link from "next/link";
import { pageViewer } from "@/lib/auth";
import { athleteForPage, coachPage } from "@/lib/pages";
import { ProfileForm } from "@/components/forms";
export default async function EditAthlete({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await pageViewer();
  coachPage(viewer);
  const athlete = await athleteForPage(viewer, (await params).id);
  return (
    <div className="page form-page">
      <Link href={`/athletes/${athlete.id}`} className="text-link">
        ← {athlete.name}
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">THE PERSON BEHIND THE PLAYER</p>
          <h1>Edit profile.</h1>
          <p>Update the athlete’s details and current focus.</p>
        </div>
      </div>
      <div className="panel form-panel">
        <ProfileForm athlete={athlete} />
      </div>
      <p className="privacy-note">
        Past assessments, measurements and training records are preserved.
      </p>
    </div>
  );
}
