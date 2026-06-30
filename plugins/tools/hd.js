import axios from "axios";
import te from "../../src/lib/ourin-error.js";
import cfg from "../../config.js";
import { ImageUploadService } from "node-upload-images";

const config = {
  name: "remini",
  alias: ["hd", "enhance", "upscale"],
  category: "tools",
  description: "Enhance gambar jadi HD",
  usage: ".remini (reply gambar)",
  example: ".remini",
  cooldown: 15,
  energi: 1,
  isEnabled: true,
};

async function ul(buf) {
  const service = new ImageUploadService("new.fastpic.org");
  const { directLink } = await service.uploadFromBinary(buf, "img.png");
  return directLink;
}

async function handler(m, { sock }) {
  const img = m.isImage || (m.quoted && m.quoted.type === "imageMessage");

  if (!img) {
    return m.reply(
      `*🪁 HD IMAGE*\n> Reply gambar\n\n\`\`\`${m.prefix}remini\`\`\``,
    );
  }

  m.react("🕕");

  try {
    let b = m.quoted?.isMedia ? await m.quoted.download() : await m.download();

    const u = await ul(b);
    let resultUrl = null;

    try {
      // Primary: API Azbry
      const azbryRes = await axios.get(`https://api.azbry.com/api/tools/hdimage?url=${encodeURIComponent(u)}`);
      if (azbryRes.data.status && azbryRes.data.result?.url) {
        resultUrl = azbryRes.data.result.url;
      } else {
        throw new Error("Azbry API response invalid");
      }
    } catch (err) {
      // Fallback: Snowping / Faa
      const res = await axios.get(`https://apis.snowping.eu.cc/api/imagehd/upscale?url=${encodeURIComponent(u)}`);
      if (res.data.status === 200 && res.data.result?.url) {
        resultUrl = res.data.result.url;
      } else {
        throw new Error("Gagal melakukan upscale, coba lagi.");
      }
    }

    if (!resultUrl) {
      throw new Error("Gagal melakukan upscale, coba lagi.");
    }

    m.react("✅");
    await sock.sendMedia(m.chat, resultUrl, null, m, { type: "image" });
  } catch (e) {
    console.log(e);
    m.react("☢");
    m.reply(te(m.prefix, m.command, m.pushName));
  }
}

export { config, handler };
