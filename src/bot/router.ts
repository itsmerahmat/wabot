import type { Socket } from "./types";
import type { WAMessage } from "@whiskeysockets/baileys";
import { getMessageText } from "./message";
import { triggers } from "./triggers";

export async function handleIncomingMessage(sock: Socket, msg: WAMessage) {
  if (!msg?.message || msg.key.fromMe) return;

  const from = msg.key.remoteJid;
  if (!from) return;

  const text = getMessageText(msg)?.trim();
  if (!text) return;

  console.log(`📩 Message from ${from}:`, text);

  const ctx = { sock, msg, from, text };

  for (const trigger of triggers) {
    if (!trigger.match(ctx)) continue;
    await trigger.handle(ctx);
    break;
  }
}
