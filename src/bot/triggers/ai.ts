import { generateText } from "../../ai/gemini";
import type { Socket, Trigger } from "../types";
import { delay, type AnyMessageContent } from "@whiskeysockets/baileys";

async function sendMessageWTyping(sock: Socket, jid: string, msg: AnyMessageContent, typingMs = 1200) {
  await sock.presenceSubscribe(jid);
  await delay(250);

  await sock.sendPresenceUpdate("composing", jid);
  await delay(typingMs);
  await sock.sendPresenceUpdate("paused", jid);

  return sock.sendMessage(jid, msg);
}

async function withTypingWhile<T>(
  sock: Socket,
  jid: string,
  work: () => Promise<T>,
  opts?: { keepAliveMs?: number; minTypingMs?: number }
): Promise<T> {
  const keepAliveMs = opts?.keepAliveMs ?? 8_000;
  const minTypingMs = opts?.minTypingMs ?? 600;

  await sock.presenceSubscribe(jid);
  await delay(250);

  const startedAt = Date.now();
  await sock.sendPresenceUpdate("composing", jid);

  const interval = setInterval(() => {
    void sock.sendPresenceUpdate("composing", jid).catch(() => undefined);
  }, keepAliveMs);

  try {
    const result = await work();
    const elapsed = Date.now() - startedAt;
    if (elapsed < minTypingMs) await delay(minTypingMs - elapsed);
    return result;
  } finally {
    clearInterval(interval);
    await sock.sendPresenceUpdate("paused", jid);
  }
}

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
      await sendMessageWTyping(sock, from, { text: "Pakai: !ai <pertanyaan>" }, 700);
      return;
    }

    try {
      const answer = await withTypingWhile(sock, from, () => generateText(prompt));
      await sock.sendMessage(from, { text: answer || "(Tidak ada jawaban)" });
    } catch (err) {
      console.error("Gemini error:", err);
      await sendMessageWTyping(sock, from, {
        text: "Maaf, AI sedang error. Cek log server & pastikan GEMINI_API_KEY sudah diset."
      }, 700);
    }
  }
};
