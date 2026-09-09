import Link from "next/link";
import { pageViewer } from "@/lib/auth";
import { coachPage } from "@/lib/pages";
import { ProfileForm } from "@/components/forms";
export const metadata = { title: "Add athlete" };
export default async function NewAthlete() {
  coachPage(await pageViewer());
  return (
    <div className="page form-page">
      <Link href="/athletes" className="text-link">
        ← Athlete roster
      </Link>
      <div className="page-heading">
        <div>
          <p className="eyebrow">A NEW DEVELOPMENT JOURNEY</p>
          <h1>Add an athlete.</h1>
          <p>Create a synthetic profile to start recording their progress.</p>
        </div>
      </div>
      <div className="panel form-panel">
        <ProfileForm />
      </div>
      <p className="privacy-note">
        Profiles created here are coach-managed. Existing seeded athletes have
        separate lab sign-ins.
      </p>
    </div>
  );
}
