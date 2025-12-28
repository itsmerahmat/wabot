import type { Trigger } from "../types";

const JAM_REGEX = /\bjam\b/i;

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(date);
}

export const timeTrigger: Trigger = {
  name: "time",
  match: ({ text }) => JAM_REGEX.test(text),
  handle: async ({ sock, from, msg }) => {
    const now = new Date();
    await sock.sendMessage(
      from,
      { text: `Sekarang jam ${formatTime(now)}` },
      { quoted: msg }
    );
  }
};
