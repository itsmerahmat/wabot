import { startBaileysBot } from "./baileys";
import { handleIncomingMessage } from "./bot/router";

async function main() {
  await startBaileysBot((sock) => {
    // Event pesan masuk (akan dipasang ulang setiap socket dibuat/reconnect)
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      const msg = messages[0];
      if (!msg) return;

      await handleIncomingMessage(sock, msg);
    });
  });

  console.log("🚀 Bot initialized!");
}

main();
