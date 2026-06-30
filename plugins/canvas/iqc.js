import te from "../../src/lib/ourin-error.js";
import moment from "moment-timezone";
import axios from "axios";

const pluginConfig = {
  name: "iqc",
  alias: ["iqchat", "iphonechat"],
  category: "canvas",
  description: "Membuat gambar chat iPhone style",
  usage: ".iqc <text>",
  example: ".iqc Hai cantik",
  isOwner: false,
  isPremium: false,
  isGroup: false,
  isPrivate: false,
  cooldown: 10,
  energi: 1,
  isEnabled: true,
};

async function handler(m, { sock }) {
  const text = m.args.join(" ");
  if (!text) {
    return m.reply(
      `📱 *ɪǫᴄ ᴄʜᴀᴛ*\n\n> Masukkan teks untuk chat\n\n\`Contoh: ${m.prefix}iqc Hai cantik\``,
    );
  }

  m.react("🕕");

  try {
    const now = new Date();
    const time = moment(now).tz("Asia/Jakarta").format("HH:mm");

    const apiUrl = `https://api.nexray.eu.cc/maker/v1/iqc?text=${encodeURIComponent(text)}&provider=INDOSAT&jam=${encodeURIComponent(time)}&baterai=100`;

    const res = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 30000
    });

    if (res.headers["content-type"] && !res.headers["content-type"].includes("image")) {
      throw new Error("Gagal membuat IQC, format bukan gambar");
    }

    const cardBuffer = Buffer.from(res.data);

    m.react("✅");
    await sock.sendMessage(m.chat, { image: cardBuffer, caption: "" }, { quoted: m });
  } catch (error) {
    console.error("[IQC]", error.message);
    m.react("☢");
    m.reply("😔 *Gagal membuat gambar chat.* \n\nSistem gagal menghubungi server pembuat chat. Silakan coba beberapa saat lagi ya.");
  }
}

export { pluginConfig as config, handler };
