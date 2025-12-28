import { GoogleGenAI } from "@google/genai";
import { requireEnv } from "../config/env";

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

let singletonClient: GoogleGenAI | undefined;

function getClient(): GoogleGenAI {
  if (!singletonClient) {
    const apiKey = requireEnv("GEMINI_API_KEY");
    singletonClient = new GoogleGenAI({ apiKey });
  }
  return singletonClient;
}

export async function generateText(prompt: string, opts?: { model?: string }) {
  const model = opts?.model ?? DEFAULT_MODEL;

  const response = await getClient().models.generateContent({
    model,
    contents: prompt
  });

  const text = response.text;
  return (typeof text === "string" ? text : "").trim();
}
