"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSuggestionMessage = handleSuggestionMessage;
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
async function handleSuggestionMessage(message) {
    // 1. Ignorar mensajes de bots o de canales que NO sean el canal público de sugerencias
    if (message.author.bot)
        return;
    if (message.channelId !== config_1.config.suggestionsPublicChannelId)
        return;
    const contenido = message.content;
    if (!contenido || contenido.trim().length === 0)
        return;
    try {
        // 2. Borramos inmediatamente el mensaje de texto plano que escribió el usuario
        await message.delete();
    }
    catch (error) {
        console.error('No se pudo borrar el mensaje en el canal de sugerencias:', error);
        return;
    }
    // 3. Obtenemos el canal de revisión del Staff
    const staffChannel = message.guild?.channels.cache.get(config_1.config.suggestionsStaffChannelId);
    if (!staffChannel) {
        console.error('❌ No se encontró el canal de revisión del Staff (suggestionsStaffChannelId).');
        return;
    }
    // 4. Construimos el Embed de revisión para los administradores
    const staffEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#e67e22') // Naranja para "Pendiente"
        .setTitle(`📥 Nueva Sugerencia`)
        .setDescription(contenido)
        .addFields({ name: '👤 Usuario', value: `${message.author} (${message.author.tag})`, inline: true }, { name: '📌 Estado', value: '⏳ **Pendiente de revisión**', inline: true })
        .setFooter({ text: `ID Usuario: ${message.author.id}` })
        .setTimestamp();
    // 5. Creamos los botones enlazados al ID del autor para que funcionen con tu suggestionHandler.ts
    const buttons = new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId(`approve_suggestion_${message.author.id}`)
        .setLabel('Aprobar y Publicar')
        .setStyle(discord_js_1.ButtonStyle.Success)
        .setEmoji('✅'), new discord_js_1.ButtonBuilder()
        .setCustomId(`reject_suggestion_${message.author.id}`)
        .setLabel('Rechazar')
        .setStyle(discord_js_1.ButtonStyle.Danger)
        .setEmoji('❌'));
    try {
        // 6. Enviamos el Embed y los botones al canal de administración/staff
        await staffChannel.send({
            embeds: [staffEmbed],
            components: [buttons],
        });
    }
    catch (error) {
        console.error('Error al enviar la sugerencia al canal del Staff:', error);
    }
}
