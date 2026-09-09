import Link from "next/link";
export default function NotFound() {
  return (
    <div className="standalone-error">
      <p className="eyebrow">KHLIM LABS · 404</p>
      <h1>This page isn’t available.</h1>
      <p>
        It may not exist, or it may not be part of your development profile.
      </p>
      <Link className="button button-dark" href="/">
        Return to your lab
      </Link>
    </div>
  );
}
