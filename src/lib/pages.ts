import { notFound } from "next/navigation";
import { AppError, type Viewer } from "./access";
import { getAthlete } from "./service";
export async function athleteForPage(viewer: Viewer, id: string) {
  try {
    return await getAthlete(viewer, id);
  } catch (error) {
    if (error instanceof AppError && error.status === 404) notFound();
    throw error;
  }
}
export function coachPage(viewer: Viewer) {
  if (viewer.role !== "COACH") notFound();
}
