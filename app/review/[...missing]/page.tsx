import { notFound } from "next/navigation";

// Unknown addresses under /review show the review's own 404 inside the review shell.
export default function MissingReviewPage() {
  notFound();
}
