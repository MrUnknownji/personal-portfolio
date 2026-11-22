import { llmsFull } from "@/lib/agentProfile";

// The whole portfolio as one Markdown document, for agents that read rather than browse.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
