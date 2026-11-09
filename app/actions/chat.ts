"use server";

import { headers } from "next/headers";
import { archivedProjects } from "@/data/archive";
import { selectedProjects } from "@/data/projects";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { consumeRateLimit, getTrustedClientIp } from "@/lib/server/rateLimit";

const GEMINI_AI_STUDIO_API_KEY = process.env.GEMINI_AI_STUDIO_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";
const MAX_PROMPT_LENGTH = 500;
const GEMINI_TIMEOUT_MS = 8_000;
const MAX_CONCURRENT_GEMINI_REQUESTS = 4;
const CHAT_RATE_LIMIT = 12;
const CHAT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const describeExperience = () =>
  PROFILE.experience
    .map((entry) => `${entry.role}, ${entry.organization} (${entry.period})`)
    .join("; ");

const describeEducation = () =>
  PROFILE.education
    .map((entry) => `${entry.title}, ${entry.institution} (${entry.period})`)
    .join("; ");

// A per-instance guard against bursts on one server. Cross-instance abuse is handled by the
// MongoDB-backed rate limit below, which every instance shares.
let activeGeminiRequests = 0;

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: unknown }>;
    };
  }>;
};

const getGeminiText = (value: unknown) => {
  if (!value || typeof value !== "object") return null;

  const response = value as GeminiResponse;
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
  return typeof text === "string" && text.trim() ? text.trim() : null;
};

function getLocalPortfolioAnswer(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase();
  const contextSummary = prompt.match(/portfolio item:\s*(.+)$/i)?.[1];

  if (contextSummary) {
    return contextSummary.length > 220 ? `${contextSummary.slice(0, 217)}...` : contextSummary;
  }

  const searchableProjects = [...selectedProjects, ...archivedProjects];
  const requestedProject = searchableProjects.find((project) => {
    return normalizedPrompt.includes(project.title.toLowerCase());
  });

  if (requestedProject) {
    return `${requestedProject.title} is a ${requestedProject.category.toLowerCase()} project: ${requestedProject.shortDescription} Tech used: ${requestedProject.technologies.slice(0, 4).join(", ")}.`;
  }

  if (/\b(who are you|your name|krypton|bot)\b/.test(normalizedPrompt)) {
    return "I am Krypton, Sandeep's portfolio assistant. Ask me about his projects, skills, experience, or how to contact him.";
  }

  if (/\b(summarize sandeep|who is sandeep|tell me about sandeep)\b/.test(normalizedPrompt)) {
    return `Sandeep is a full-stack developer in ${PROFILE.location}. Experience: ${describeExperience()}. The site shows ${selectedProjects.length} of his projects. Download his résumé at ${PROFILE.resumePath}.`;
  }

  if (/\b(who am i|my name)\b/.test(normalizedPrompt)) {
    return "You are a visitor exploring Sandeep's portfolio. I can help you find the right project, skill, or contact detail.";
  }

  if (/\b(contact|email|reach|hire|available)\b/.test(normalizedPrompt)) {
    return `Sandeep is open to ${PROFILE.openTo.toLowerCase()}. Use the contact form or email him at ${SITE_CONFIG.email}.`;
  }

  if (/\b(skill|stack|technology|tech|frontend|backend)\b/.test(normalizedPrompt)) {
    return PROFILE.skills
      .slice(0, 4)
      .map((skill) => `${skill.group}: ${skill.items.join(", ")}.`)
      .join(" ");
  }

  if (/\b(project|work|portfolio|built|apps?)\b/.test(normalizedPrompt)) {
    const featuredProjects = selectedProjects
      .slice(0, 4)
      .map((project) => project.title)
      .join(", ");

    return `Featured projects include ${featuredProjects}. Open the Projects page for demos, source links, galleries, and tech stacks.`;
  }

  if (
    /\b(experience|job|tcs|journey|background|education|degree|university|framerelay|studio)\b/.test(
      normalizedPrompt,
    )
  ) {
    return `Experience: ${describeExperience()}. Education: ${describeEducation()}.`;
  }

  return null;
}

export async function chatWithBot(prompt: string) {
  if (typeof prompt !== "string") {
    return "Please enter a question about Sandeep's work.";
  }

  const normalizedPrompt = prompt.replace(/\s+/g, " ").trim();
  if (!normalizedPrompt) {
    return "Please enter a question about Sandeep's work.";
  }

  if (normalizedPrompt.length > MAX_PROMPT_LENGTH) {
    return `Please keep your question under ${MAX_PROMPT_LENGTH} characters.`;
  }

  const localAnswer = getLocalPortfolioAnswer(normalizedPrompt);
  if (localAnswer) return localAnswer;

  const geminiApiKeys = Array.from(
    new Set(
      [GEMINI_AI_STUDIO_API_KEY, GEMINI_API_KEY].filter((key): key is string => Boolean(key)),
    ),
  );

  if (geminiApiKeys.length === 0) {
    return "Ask me about Sandeep's projects, skills, experience, availability, or contact details. I can answer those instantly.";
  }

  const portfolioData = {
    owner: SITE_CONFIG.firstName,
    role: SITE_CONFIG.role,
    skills: PROFILE.skills.flatMap((skill) => skill.items),
    experience: PROFILE.experience.map(
      (entry) => `${entry.period}: ${entry.role}, ${entry.organization}`,
    ),
    education: describeEducation(),
    openTo: PROFILE.openTo,
    projects: selectedProjects.map((project) => {
      return `${project.title}: ${project.shortDescription}`;
    }),
  };

  const systemInstructionText = `
    IDENTITY: You are Krypton, a playful, witty robot assistant living on Sandeep's portfolio website.

    THE CAST:
    1. ME (The AI): Krypton.
    2. CREATOR: Sandeep (My Boss/Developer).
    3. USER: A Visitor/Guest checking out the portfolio. (The user is NOT Sandeep).

    CONTEXT: ${JSON.stringify(portfolioData)}

    STYLE: Friendly, concise, specific, and useful. Be lightly playful, not noisy.

    MISSION:
    - Entertain the visitor.
    - Answer questions about Sandeep's portfolio using only the CONTEXT. Never invent employers, dates, or numbers.
    - If the user asks "Who am I?", tell them they are a welcome guest/visitor.
    - If the visitor asks about hiring or contact, mention ${SITE_CONFIG.email}.
    - If unsure, guide the visitor to the Projects page or Contact section.
    - Keep answers short (under 45 words).
    `;

  const requestHeaders = await headers();

  try {
    const rateLimit = await consumeRateLimit({
      namespace: "portfolio-chat",
      identifier: getTrustedClientIp(requestHeaders),
      limit: CHAT_RATE_LIMIT,
      windowMs: CHAT_RATE_LIMIT_WINDOW_MS,
    });

    if (!rateLimit.allowed) {
      return "I have answered quite a few questions from this connection. Please try again in a few minutes.";
    }
  } catch {
    return "My cloud brain is unavailable right now. I can still answer questions about projects, skills, experience, hiring, or contact details.";
  }

  if (activeGeminiRequests >= MAX_CONCURRENT_GEMINI_REQUESTS) {
    return "I am helping several visitors right now. Please try again in a moment.";
  }

  const payload = {
    contents: [{ role: "user", parts: [{ text: normalizedPrompt }] }],
    systemInstruction: { parts: [{ text: systemInstructionText }] },
    generationConfig: { temperature: 1.1, maxOutputTokens: 200, topP: 0.95 },
    safetySettings: [
      {
        category: "HARM_CATEGORY_HATE_SPEECH",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_DANGEROUS_CONTENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
      {
        category: "HARM_CATEGORY_HARASSMENT",
        threshold: "BLOCK_MEDIUM_AND_ABOVE",
      },
    ],
  };

  const startedAt = Date.now();
  activeGeminiRequests += 1;

  try {
    for (const apiKey of geminiApiKeys) {
      const remainingTime = GEMINI_TIMEOUT_MS - (Date.now() - startedAt);
      if (remainingTime <= 0) break;

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey,
          },
          body: JSON.stringify(payload),
          cache: "no-store",
          signal: AbortSignal.timeout(Math.min(5_000, remainingTime)),
        });

        if (!response.ok) {
          console.warn("Gemini request failed", {
            status: response.status,
            durationMs: Date.now() - startedAt,
          });
          continue;
        }

        const text = getGeminiText(await response.json());

        if (text) {
          return text.slice(0, 1_000);
        }
      } catch (error) {
        console.warn("Gemini request did not complete", {
          reason: error instanceof Error ? error.name : "unknown",
          durationMs: Date.now() - startedAt,
        });
      }
    }
  } finally {
    activeGeminiRequests = Math.max(0, activeGeminiRequests - 1);
  }

  return "My cloud brain is unavailable right now, but Sandeep's portfolio is fully online. Try asking about projects, skills, or contact details.";
}
