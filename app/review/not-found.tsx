import Link from "next/link";

export default function ReviewNotFound() {
  return (
    <section className="ld-wrap ld-page ld-state" aria-labelledby="ld-missing-title">
      <span className="ld-anno">Sheet missing · 404</span>
      <h1 id="ld-missing-title">This sheet isn&apos;t in the set.</h1>
      <p>The address may have changed. You can go back to the work or start again.</p>
      <div className="ld-actions">
        <Link className="ld-link-strong" href="/review/my-projects">
          Explore projects <span aria-hidden="true">→</span>
        </Link>
        <Link className="ld-link-strong" href="/review">
          Return home <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
