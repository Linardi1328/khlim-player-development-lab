"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="standalone-error">
      <h1>The lab needs a moment.</h1>
      <p>We couldn’t connect to the lab. Please try again.</p>
      <button className="button button-dark" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
