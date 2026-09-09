"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import type { Viewer } from "@/lib/access";
import { Avatar } from "./ui";
export function Shell({
  viewer,
  children,
}: {
  viewer: Viewer;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const coach = viewer.role === "COACH";
  const links = coach
    ? [
        { href: "/dashboard", title: "Overview", icon: LayoutDashboard },
        { href: "/athletes", title: "Athlete roster", icon: Users },
      ]
    : [
        {
          href: `/athletes/${viewer.athleteId}`,
          title: "My development",
          icon: Activity,
        },
      ];
  async function logout() {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      if (!res.ok) throw new Error();
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Sign out failed. Try again.");
      setBusy(false);
    }
  }
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <Link
          href={links[0].href}
          className="brand"
          aria-label="KHLIM Player Development Lab home"
        >
          <span className="brand-mark">
            K<span>↗</span>
          </span>
          <span>
            <strong>
              KHLIM <small>LABS</small>
            </strong>
            <em>PLAYER DEVELOPMENT</em>
          </span>
        </Link>
        <div className="workspace-label">THE DEVELOPMENT LAB</div>
        <nav aria-label="Main navigation">
          {links.map(({ href, title, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`nav-link ${(href === "/athletes" ? pathname.startsWith(href) : pathname === href) ? "active" : ""}`}
              aria-current={
                (
                  href === "/athletes"
                    ? pathname.startsWith(href)
                    : pathname === href
                )
                  ? "page"
                  : undefined
              }
            >
              <Icon size={19} />
              {title}
              <ArrowUpRight className="nav-arrow" size={15} />
            </Link>
          ))}
        </nav>
        <div className="sidebar-note">
          <FlaskConical size={20} />
          <strong>A space to get better.</strong>
          <p>Small steps. Consistent practice. Progress that lasts.</p>
          <span>EXPERIMENT 001</span>
        </div>
        <div className="account">
          <Avatar name={viewer.name} />
          <div>
            <strong>{viewer.name}</strong>
            <span>{coach ? "Coach" : "Athlete"} · Lab account</span>
          </div>
          <button
            aria-label="Sign out"
            title="Sign out"
            onClick={logout}
            disabled={busy}
            className="icon-button"
          >
            <LogOut size={18} />
          </button>
        </div>
        {error && <p role="alert">{error}</p>}
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <span>
            <span className="live-dot" />
            KHLIM PLAYER DEVELOPMENT LAB
          </span>
          <span className="prototype-tag">
            Synthetic data <span>·</span> Prototype
          </span>
        </header>
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <footer>
          Built for development. Designed for possibility.
          <span>KHLIM Labs · Experimental prototype</span>
        </footer>
      </div>
    </div>
  );
}
