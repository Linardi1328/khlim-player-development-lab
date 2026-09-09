import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <div className="auth-simple-page">
      <section className="panel auth-simple-card">
        <LanguageSwitcher />
        <Link href="/login" className="text-link">← Back to sign in</Link>
        <p className="eyebrow">KHLIM LABS · LOCAL ACCOUNT RECOVERY</p>
        <h1>Reset your password</h1>
        <p>Enter your lab account email to continue.</p>
        <ForgotPasswordForm />
      </section>
    </div>
  );
}
