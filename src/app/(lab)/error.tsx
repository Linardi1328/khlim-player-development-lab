"use client";
import { useEffect } from "react";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    document.getElementById("error-title")?.focus();
  }, []);
  return (
    <div className="page">
      <div className="empty">
        <h1 id="error-title" tabIndex={-1}>
          The lab needs a moment.
        </h1>
        <p>We couldn’t load your development information. Please try again.</p>
        <button className="button button-dark" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
