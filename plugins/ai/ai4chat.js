import { f } from '../../src/lib/ourin-http.js'
import te from '../../src/lib/ourin-error.js'
import axios from 'axios'
import config from '../../config.js'
const pluginConfig = {
    name: 'ai4chat',
    alias: ['ai'],
    category: 'ai',
    description: 'Chat dengan AI4Chat',
    usage: '.ai4chat <pertanyaan>',
    example: '.ai4chat Apa itu JavaScript?',
    isOwner: false,
    isPremium: false,
    isGroup: false,
    isPrivate: false,
    cooldown: 5,
    energi: 1,
    isEnabled: true
}

async function handler(m) {
    const text = m.text
    if (!text) {
        return m.reply(`🤖 *ᴀɪᴄʜᴀᴛ*\n\n> Masukkan pertanyaan\n\n\`Contoh: ${m.prefix}ai4chat Apa itu JavaScript?\``)
    }
    m.react('🕕')
    try {
        const data = await axios.get(`https://firefly.maiku.my.id/api/deepaichat?apikey=${config.APIkey.firefly}&text=${encodeURIComponent(text)}`)
        m.react('✅')
        await m.reply(`${data.data.data}`)
    } catch (error) {
        m.react('☢')
        console.log(error)
        m.reply(te(m.prefix, m.command, m.pushName))
    }
}

export { pluginConfig as config, handler }