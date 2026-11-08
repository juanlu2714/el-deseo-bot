"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGuildMemberAdd = handleGuildMemberAdd;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
async function handleGuildMemberAdd(member) {
    // Buscamos el canal configurado
    const channel = member.guild.channels.cache.get(config_1.config.welcomeChannelId);
    if (!channel)
        return;
    const welcomeEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#00ff88')
        .setTitle(`¡Bienvenido/a a El Deseo, ${member.user.username}! 🎉`)
        .setDescription(`¡Hola ${member}! Nos alegra mucho tenerte por aquí.\n\n` +
        `📌 **Puntos clave para empezar:**\n` +
        `• Revisa las normas de la comunidad para evitar sanciones.\n` +
        `• Consulta los canales de noticias de nuestras clústeres de ARK.\n` +
        `• Si necesitas ayuda, puedes abrir un ticket de soporte.`)
        .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
        .setFooter({
        text: 'El Deseo • Powered by Xelcore',
        iconURL: member.guild.iconURL() || undefined
    })
        .setTimestamp();
    await channel.send({
        content: `¡Bienvenido/a ${member}! 👋`,
        embeds: [welcomeEmbed],
    });
}
