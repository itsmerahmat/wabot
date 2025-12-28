import { generateText } from "../../ai/gemini";
import type { Trigger } from "../types";

function parseAiPrompt(text: string): string | undefined {
  if (!text.startsWith("!ai")) return undefined;
  const prompt = text.replace(/^!ai\s*/i, "").trim();
  return prompt.length > 0 ? prompt : "";
}

export const aiTrigger: Trigger = {
  name: "ai",
  match: ({ text }) => text.startsWith("!ai"),
  handle: async ({ sock, from, text }) => {
    const prompt = parseAiPrompt(text);
    if (prompt === undefined) return;

    if (prompt === "") {
      await sock.sendMessage(from, { text: "Pakai: !ai <pertanyaan>" });
      return;
    }

    try {
      const answer = await generateText(prompt);
      await sock.sendMessage(from, { text: answer || "(Tidak ada jawaban)" });
    } catch (err) {
      console.error("Gemini error:", err);
      await sock.sendMessage(from, {
        text: "Maaf, AI sedang error. Cek log server & pastikan GEMINI_API_KEY sudah diset."
      });
    }
  }
};
