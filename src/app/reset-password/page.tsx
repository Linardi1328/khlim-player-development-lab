import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ResetPasswordForm } from "@/components/auth-forms";

export const metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const token = (await searchParams).token ?? "";
  return (
    <div className="auth-simple-page">
      <section className="panel auth-simple-card">
        <LanguageSwitcher />
        <Link href="/login" className="text-link">
          ← Back to sign in
        </Link>
        <p className="eyebrow">KHLIM LABS · LOCAL ACCOUNT RECOVERY</p>
        <h1>Choose a new password</h1>
        <p>
          This reset is for the synthetic local lab only. It also signs out any
          existing sessions for this account.
        </p>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="field-error" role="alert">
            This reset link is invalid or expired.
          </p>
        )}
      </section>
    </div>
  );
}
