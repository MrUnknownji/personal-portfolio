import Link from "next/link";

export default function NotFound() {
  return (
    <section className="portfolio-state offset-wrap" aria-labelledby="not-found-title">
      <div>
        <span className="offset-kicker">Build file / 404</span>
        <h1 id="not-found-title">This page<br />is missing<span>.</span></h1>
        <p>The address may have changed. You can return to the work or start again.</p>
        <div className="portfolio-state-actions"><Link href="/my-projects">Explore projects ↗</Link><Link href="/">Return home ↗</Link></div>
      </div>
    </section>
  );
}
