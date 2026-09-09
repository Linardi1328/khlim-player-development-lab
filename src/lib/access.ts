export type Viewer = {
  id: string;
  name: string;
  role: "COACH" | "ATHLETE";
  athleteId: string | null;
};
export class AppError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function assertCoach(viewer: Viewer) {
  if (viewer.role !== "COACH")
    throw new AppError(403, "Only coaches can make this change.");
}
export function assertAthleteAccess(viewer: Viewer, athleteId: string) {
  if (viewer.role !== "COACH" && viewer.athleteId !== athleteId)
    throw new AppError(404, "Athlete not found.");
}
