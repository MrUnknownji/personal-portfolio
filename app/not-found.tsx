import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center px-4 py-32" aria-labelledby="not-found-title">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">404</p>
        <h1 id="not-found-title" className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">The page may have moved, or the address may be incorrect.</p>
        <Link href="/" className="mt-8 inline-flex rounded-xl bg-primary px-6 py-3 font-bold text-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Return home</Link>
      </div>
    </section>
  );
}
