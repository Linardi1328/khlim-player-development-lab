import Link from "next/link";
import { ArrowUpRight, Plus, Search } from "lucide-react";
import { pageViewer } from "@/lib/auth";
import { coachPage } from "@/lib/pages";
import { getRoster } from "@/lib/service";
import { formatDate } from "@/lib/domain";
import { Avatar, Badge, Empty } from "@/components/ui";
export const metadata = { title: "Athlete roster" };
export default async function Roster({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; group?: string }>;
}) {
  const viewer = await pageViewer();
  coachPage(viewer);
  const { search = "", group = "" } = await searchParams;
  const athletes = await getRoster(viewer, search, group);
  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">INDIVIDUAL JOURNEYS. SHARED COMMITMENT.</p>
          <h1>
            Athlete roster<span className="count-pill">{athletes.length}</span>
          </h1>
          <p>Know the person behind the player. Find their next step.</p>
        </div>
        <Link className="button button-dark" href="/athletes/new">
          <Plus size={17} />
          Add athlete
        </Link>
      </div>
      <form className="roster-filters" method="GET">
        <div className="search-field">
          <Search size={18} />
          <label className="sr-only" htmlFor="search">
            Search athletes
          </label>
          <input
            id="search"
            name="search"
            placeholder="Search by athlete name…"
            defaultValue={search}
          />
        </div>
        <label className="sr-only" htmlFor="group">
          Development group
        </label>
        <select id="group" name="group" defaultValue={group}>
          <option value="">All groups</option>
          <option>U9</option>
          <option>U12</option>
          <option>U15</option>
        </select>
        <button className="button button-small">Apply filters</button>
        {(search || group) && (
          <Link href="/athletes" className="text-link">
            Clear
          </Link>
        )}
      </form>
      {athletes.length ? (
        <div className="roster-grid">
          {athletes.map((athlete) => (
            <Link
              className="athlete-card"
              key={athlete.id}
              href={`/athletes/${athlete.id}`}
            >
              <div className="athlete-card-top">
                <Avatar name={athlete.name} large />
                <Badge>{athlete.group}</Badge>
                <span className="jersey">
                  #{String(athlete.jerseyNumber).padStart(2, "0")}
                </span>
              </div>
              <h2>{athlete.name}</h2>
              <p className="position">{athlete.position}</p>
              <div className="athlete-focus">
                <span className="eyebrow">CURRENT FOCUS</span>
                <p>{athlete.focus}</p>
              </div>
              <div className="athlete-card-bottom">
                <span>
                  {athlete.assessments[0]
                    ? `Checked in ${formatDate(athlete.assessments[0].assessedAt)}`
                    : "Ready for a first check-in"}
                </span>
                <ArrowUpRight size={19} />
              </div>
              <div className="athlete-card-meta">
                <span>
                  {athlete.goals.filter((g) => g.status !== "COMPLETED").length}{" "}
                  active goals
                </span>
                <span>{athlete._count.training} sessions</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          title="No athletes found"
          href="/athletes"
          action="Clear filters"
        >
          Try a different name or development group.
        </Empty>
      )}
    </div>
  );
}
