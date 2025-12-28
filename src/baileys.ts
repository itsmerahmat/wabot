import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from "@whiskeysockets/baileys";
import { printQRCode } from "./utils/qrcode";
import pino from "pino";
import type { Boom } from "@hapi/boom";

type Socket = ReturnType<typeof makeWASocket>;

export async function startBaileysBot(onSocket?: (sock: Socket) => void) {
  const { state, saveCreds } = await useMultiFileAuthState("auth_session");
  const logger = pino({ level: process.env.LOG_LEVEL ?? "info" });

  const sock = makeWASocket({
    auth: state,
    logger,
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    connectTimeoutMs: 60_000,
    defaultQueryTimeoutMs: 60_000,
    keepAliveIntervalMs: 20_000,
    getMessage: async () => undefined
  });

  onSocket?.(sock);

  sock.ev.on("creds.update", saveCreds);

  let didScheduleReconnect = false;

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("🔗 Scan QR Code below:");
      printQRCode(qr);
    }

    if (connection === "open") {
      console.log("✅ Connected to WhatsApp!");
    }

    if (connection === "close") {
      const statusCode = (lastDisconnect?.error as Boom | undefined)?.output?.statusCode;
      const reasonText = (lastDisconnect?.error as any)?.message;
      const loggedOut = statusCode === DisconnectReason.loggedOut;

      console.log(
        "❌ Connection closed",
        loggedOut ? "(Logged out)" : "",
        statusCode ? `(status=${statusCode})` : "",
        reasonText ? `- ${reasonText}` : ""
      );

      if (!loggedOut && !didScheduleReconnect) {
        didScheduleReconnect = true;
        setTimeout(() => {
          void startBaileysBot(onSocket);
        }, 2000);
      }
    }
  });

  return sock;
}
