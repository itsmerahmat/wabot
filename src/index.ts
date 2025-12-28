import { startBaileysBot } from "./baileys";

async function main() {
  await startBaileysBot((sock) => {
    // Event pesan masuk (akan dipasang ulang setiap socket dibuat/reconnect)
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
      if (type !== "notify") return;

      const msg = messages[0];
      if (!msg?.message || msg.key.fromMe) return;

      const from = msg.key.remoteJid!;
      const text = msg.message.conversation || msg.message?.extendedTextMessage?.text;

      console.log(`📩 Message from ${from}:`, text);

      if (text?.toLowerCase().includes("hi")) {
        await sock.sendMessage(from, { text: "Hello there! 👋" });
      }
    });
  });

  console.log("🚀 Bot initialized!");
}

main();
