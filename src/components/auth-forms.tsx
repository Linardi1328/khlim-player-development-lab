"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { PasswordInput } from "./forms";
import { useLanguage } from "./language-provider";

export function ForgotPasswordForm() {
  const { tr } = useLanguage();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [resetUrl, setResetUrl] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setResetUrl("");
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(new FormData(event.currentTarget)),
        ),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Unable to start password reset.");
      if (typeof data.resetUrl === "string") setResetUrl(data.resetUrl);
      else
        setError(
          data.message ?? "No reset option is available for that account.",
        );
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to start password reset.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="reset-email">{tr("Email address")}</label>
        <input
          id="reset-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          disabled={pending}
        />
      </div>
      <button className="button button-dark" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={17} />
            {tr("Saving…")}
          </>
        ) : (
          <>
            {tr("Send reset link")}
            <ArrowRight size={17} />
          </>
        )}
      </button>
      {resetUrl && (
        <div className="auth-success" role="status">
          <p>
            {tr(
              "This local lab does not send email. The reset link is shown here for synthetic accounts only.",
            )}
          </p>
          <Link className="button button-lime" href={resetUrl}>
            {tr("Continue to reset password")}
            <ArrowRight size={17} />
          </Link>
        </div>
      )}
      {error && (
        <p className="field-error" role="alert">
          {tr(error)}
        </p>
      )}
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const { tr } = useLanguage();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPending(false);
      return;
    }
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Unable to reset password.");
      setSaved(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to reset password.",
      );
    } finally {
      setPending(false);
    }
  }

  if (saved)
    return (
      <div className="auth-success" role="status">
        <p>{tr("Password updated. You can sign in now.")}</p>
        <Link className="button button-dark" href="/login">
          {tr("Back to sign in")}
          <ArrowRight size={17} />
        </Link>
      </div>
    );

  return (
    <form className="auth-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="new-password">{tr("New password")}</label>
        <PasswordInput
          id="new-password"
          name="password"
          autoComplete="new-password"
          disabled={pending}
        />
        <p className="field-help">{tr("Use at least 10 characters.")}</p>
      </div>
      <div className="field">
        <label htmlFor="confirm-password">{tr("Confirm password")}</label>
        <PasswordInput
          id="confirm-password"
          name="confirmPassword"
          autoComplete="new-password"
          disabled={pending}
        />
      </div>
      <button className="button button-dark" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" size={17} />
            {tr("Saving…")}
          </>
        ) : (
          <>
            {tr("Reset password")}
            <ArrowRight size={17} />
          </>
        )}
      </button>
      {error && (
        <p className="field-error" role="alert">
          {tr(error)}
        </p>
      )}
    </form>
  );
}
