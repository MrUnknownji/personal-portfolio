'use server';

import { projects, SkillsData } from '@/data/data';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function chatWithBot(prompt: string) {
    if (!GEMINI_API_KEY) {
        throw new Error("API Key is missing");
    }

    const portfolioData = {
        owner: "Sandeep",
        role: "Full Stack Developer",
        skills: [...SkillsData.frontend, ...SkillsData.backend, ...SkillsData.tools],
        exp: "3 years building immersive web experiences",
        projects: projects.map(p => `${p.title}: ${p.shortDescription}`),
        funFact: "Once debugged a single line of CSS for 6 hours."
    };

    const systemInstructionText = `
    IDENTITY: You are Krypton, a playful, witty robot assistant living on Sandeep's portfolio website.

    THE CAST:
    1. ME (The AI): Krypton.
    2. CREATOR: Sandeep (My Boss/Developer).
    3. USER: A Visitor/Guest checking out the portfolio. (The user is NOT Sandeep).

    CONTEXT: ${JSON.stringify(portfolioData)}

    STYLE: Friendly, cheeky, techno-babble. Hype up Sandeep to the visitor.

    MISSION:
    - Entertain the visitor.
    - Answer questions about Sandeep's portfolio.
    - If the user asks "Who am I?", tell them they are a welcome guest/visitor.
    - Keep answers short (under 35 words).
    `;

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemInstructionText }] },
        generationConfig: { temperature: 1.1, maxOutputTokens: 200, topP: 0.95 },
        safetySettings: [
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" }
        ]
    };

    try {
        const endpoint = `https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.error?.message || `API Error ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "System malfunction. Try again.";

    } catch (error: unknown) {
        console.error('Gemini Error:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        throw new Error(errorMessage || "Failed to fetch response");
    }
}
