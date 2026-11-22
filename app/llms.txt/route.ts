import { llmsIndex } from "@/lib/agentProfile";

// The llms.txt convention (llmstxt.org): a Markdown index for AI agents, built at deploy time.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsIndex(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
