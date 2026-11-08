"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuggestionMessage = handleSuggestionMessage;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
async function handleSuggestionMessage(message) {
    // Ignorar mensajes enviados por bots o fuera de un servidor
    if (message.author.bot || !message.guild)
        return;
    // Solo actuar si el mensaje se envía en el canal público/abierto de sugerencias
    if (message.channelId !== config_1.config.suggestionsPublicChannelId)
        return;
    const content = message.content.trim();
    if (!content)
        return;
    // Borramos el mensaje de texto del usuario para mantener el canal limpio
    try {
        await message.delete();
    }
    catch (error) {
        console.error('No se pudo borrar el mensaje original:', error);
    }
    // Obtenemos el canal de revisión del Staff
    const staffChannel = message.guild.channels.cache.get(config_1.config.suggestionsStaffChannelId);
    if (!staffChannel)
        return;
    // Creamos la tarjeta para el Staff
    const staffEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#e67e22') // Naranja (Pendiente)
        .setTitle('📥 Nueva Sugerencia (Mensaje Directo)')
        .setDescription(content)
        .addFields({ name: '👤 Usuario', value: `${message.author} (${message.author.tag})`, inline: true }, { name: '📌 Estado', value: '⏳ **Pendiente de revisión**', inline: true })
        .setFooter({ text: `ID Usuario: ${message.author.id}` })
        .setTimestamp();
    const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId(`approve_suggestion_${message.author.id}`)
        .setLabel('Aprobar y Publicar')
        .setStyle(discord_js_1.ButtonStyle.Success)
        .setEmoji('✅'), new discord_js_1.ButtonBuilder()
        .setCustomId(`reject_suggestion_${message.author.id}`)
        .setLabel('Rechazar')
        .setStyle(discord_js_1.ButtonStyle.Danger)
        .setEmoji('❌'));
    await staffChannel.send({
        embeds: [staffEmbed],
        components: [buttons],
    });
    // (Opcional) Notificamos efímeramente o mediante MP al usuario si se desea
}
