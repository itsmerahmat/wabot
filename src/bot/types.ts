import type makeWASocket from "@whiskeysockets/baileys";
import type { WAMessage } from "@whiskeysockets/baileys";

export type Socket = ReturnType<typeof makeWASocket>;

export type TriggerContext = {
  sock: Socket;
  msg: WAMessage;
  from: string;
  text: string;
};

export type Trigger = {
  name: string;
  match: (ctx: TriggerContext) => boolean;
  handle: (ctx: TriggerContext) => Promise<void>;
};
