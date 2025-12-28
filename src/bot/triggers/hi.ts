import type { Trigger } from "../types";

export const hiTrigger: Trigger = {
  name: "hi",
  match: ({ text }) => text.toLowerCase().includes("hi"),
  handle: async ({ sock, from }) => {
    await sock.sendMessage(from, { text: "Hello there! 👋" });
  }
};
