import { notFound } from "next/navigation";

// Unknown addresses show the live site's 404 inside its own header and footer.
export default function MissingPage() {
  notFound();
}
