import { redirect } from "next/navigation";
import { getViewer } from "@/lib/auth";
export default async function Home() {
  const viewer = await getViewer();
  redirect(
    !viewer
      ? "/login"
      : viewer.role === "COACH"
        ? "/dashboard"
        : `/athletes/${viewer.athleteId}`,
  );
}
