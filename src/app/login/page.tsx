import { redirect } from "next/navigation";
import { ArrowUpRight, FlaskConical } from "lucide-react";
import { authProvider, getViewer } from "@/lib/auth";
import { LoginForm } from "@/components/forms";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Court } from "@/components/ui";

export const metadata = { title: "Sign in" };

export default async function Login() {
  const viewer = await getViewer();
  if (viewer) redirect(viewer.role === "COACH" ? "/dashboard" : `/athletes/${viewer.athleteId}`);

  return (
    <div className="login-page">
      <section className="login-story">
        <div className="brand"><span className="brand-mark">K↗</span><strong>KHLIM <small>LABS</small></strong></div>
        <div className="login-message">
          <p className="eyebrow"><span className="live-dot" />PLAYER DEVELOPMENT LAB</p>
          <h1>Better players.<br />One practice<br /><span>at a time.</span></h1>
          <p>A place to see the progress, celebrate the effort, and build what comes next.</p>
          <div className="login-values">
            <span>01 <strong>Observe</strong></span><span>02 <strong>Develop</strong></span><span>03 <strong>Reflect</strong></span>
          </div>
        </div>
        <Court />
        <div className="login-foot"><FlaskConical size={18} />An experiment in long-term athlete development <ArrowUpRight size={18} /></div>
      </section>
      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-language"><LanguageSwitcher /></div>
          <span className="prototype-tag">KHLIM LABS · EXPERIMENT 001</span>
          <h2>Welcome to the lab.</h2>
          <p>Sign in to see the work behind the progress.</p>
          <LoginForm />
          {authProvider() === "lab" && (
            <div className="demo-accounts">
              <h3>Explore with a lab account</h3>
              <p>All athletes and records are fictional.</p>
              <dl>
                <div><dt>Coach</dt><dd data-no-translate>coach1@playerlab.example.test</dd></div>
                <div><dt>Athlete</dt><dd data-no-translate>athlete1@playerlab.example.test</dd></div>
                <div><dt>Password</dt><dd data-no-translate>LabPractice!2026</dd></div>
              </dl>
              <p className="lab-reset-note">This is the default fixture password. A local password reset can change it for this database.</p>
            </div>
          )}
          <p className="login-disclaimer">An isolated prototype. Please do not enter real athlete or personal information.</p>
        </div>
      </section>
    </div>
  );
}
