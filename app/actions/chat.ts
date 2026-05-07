"use server";

import { projects, SkillsData } from "@/data/data";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.1-flash-lite-preview";

function getLocalPortfolioAnswer(prompt: string) {
  const normalizedPrompt = prompt.toLowerCase();
  const contextSummary = prompt.match(/portfolio item:\s*(.+)$/i)?.[1];

  if (contextSummary) {
    return contextSummary.length > 220
      ? `${contextSummary.slice(0, 217)}...`
      : contextSummary;
  }

  const requestedProject = projects.find((project) =>
    normalizedPrompt.includes(project.title.toLowerCase()),
  );

  if (requestedProject) {
    return `${requestedProject.title} is a ${requestedProject.category.toLowerCase()} project: ${requestedProject.shortDescription} Tech used: ${requestedProject.technologies.slice(0, 4).join(", ")}.`;
  }

  if (/\b(who are you|your name|krypton|bot)\b/.test(normalizedPrompt)) {
    return "I am Krypton, Sandeep's portfolio assistant. Ask me about his projects, skills, experience, or how to contact him.";
  }

  if (/\b(who am i|my name)\b/.test(normalizedPrompt)) {
    return "You are a visitor exploring Sandeep's portfolio. I can help you find the right project, skill, or contact detail.";
  }

  if (/\b(contact|email|reach|hire|available)\b/.test(normalizedPrompt)) {
    return "Sandeep is available for full stack work. Use the contact form or email him at sandeepkhati788@gmail.com.";
  }

  if (/\b(skill|stack|technology|tech|frontend|backend)\b/.test(normalizedPrompt)) {
    return "Sandeep works with React, Next.js, TypeScript, Tailwind CSS, GSAP, Node.js, Express, MongoDB, REST APIs, and deployment tools like Vercel.";
  }

  if (/\b(project|work|portfolio|built|apps?)\b/.test(normalizedPrompt)) {
    const featuredProjects = projects
      .slice(0, 4)
      .map((project) => project.title)
      .join(", ");

    return `Featured projects include ${featuredProjects}. Open the Projects page for demos, source links, galleries, and tech stacks.`;
  }

  if (/\b(experience|job|tcs|journey|background)\b/.test(normalizedPrompt)) {
    return "Sandeep started web development in 2020, graduated in Computer Science, and works as an Analyst at TCS while building full stack products.";
  }

  return null;
}

export async function chatWithBot(prompt: string) {
  const localAnswer = getLocalPortfolioAnswer(prompt);
  if (localAnswer) return localAnswer;

  if (!GEMINI_API_KEY) {
    return "Ask me about Sandeep's projects, skills, experience, availability, or contact details. I can answer those instantly.";
  }

  const portfolioData = {
    owner: "Sandeep",
    role: "Full Stack Developer",
    skills: [
      ...SkillsData.frontend,
      ...SkillsData.backend,
      ...SkillsData.tools,
    ],
    exp: "3 years building immersive web experiences",
    projects: projects.map((project) => {
      return `${project.title}: ${project.shortDescription}`;
    }),
    funFact: "Once debugged a single line of CSS for 6 hours.",
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
    - Answer questions about Sandeep's portfolio.
    - If the user asks "Who am I?", tell them they are a welcome guest/visitor.
    - If the visitor asks about hiring or contact, mention sandeepkhati788@gmail.com.
    - If unsure, guide the visitor to the Projects page or Contact section.
    - Keep answers short (under 45 words).
    `;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstructionText }] },
    generationConfig: { temperature: 1.1, maxOutputTokens: 200, topP: 0.95 },
    safetySettings: [
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      {
        category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        threshold: "BLOCK_NONE",
      },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
    ],
  };

  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error ${response.status}`);
    }

    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "System response was empty. Ask me about Sandeep's projects or skills."
    );
  } catch {
    return "My cloud brain is unavailable right now, but Sandeep's portfolio is fully online. Try asking about projects, skills, or contact details.";
  }
}
