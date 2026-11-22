import { jsonResume } from "@/lib/agentProfile";

// The résumé in the JSON Resume schema, for applicant-tracking tools and agents.
export const dynamic = "force-static";

export function GET() {
  return Response.json(jsonResume());
}
