import Link from "next/link";
import { ArrowUpRight, CircleDot, Plus } from "lucide-react";
import { initials } from "@/lib/domain";
export function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  return (
    <span className={`avatar ${large ? "avatar-lg" : ""}`} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
export function Empty({
  title,
  children,
  href,
  action,
}: {
  title: string;
  children: React.ReactNode;
  href?: string;
  action?: string;
}) {
  return (
    <div className="empty">
      <CircleDot size={30} aria-hidden="true" />
      <h3>{title}</h3>
      <p>{children}</p>
      {href && (
        <Link className="button button-dark" href={href}>
          <Plus size={16} />
          {action}
        </Link>
      )}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  href,
  action,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="section-title">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {action ?? "View all"}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function Stat({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: React.ReactNode;
  detail: string;
  accent?: boolean;
}) {
  return (
    <div className={`stat ${accent ? "stat-accent" : ""}`}>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </div>
  );
}
export function Court() {
  return (
    <svg className="court" viewBox="0 0 500 300" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="30" y="20" width="440" height="260" rx="2" />
        <path d="M250 20v260" />
        <circle cx="250" cy="150" r="43" />
        <path d="M30 90h90v120H30m440-120h-90v120h90" />
        <path d="M30 48h28a103 103 0 0 1 0 204H30m440-204h-28a103 103 0 0 0 0 204h28" />
        <circle cx="120" cy="150" r="35" />
        <circle cx="380" cy="150" r="35" />
        <path d="M48 134v32m404-32v32" />
        <circle cx="55" cy="150" r="7" />
        <circle cx="445" cy="150" r="7" />
      </g>
    </svg>
  );
}
