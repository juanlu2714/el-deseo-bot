"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleAnnouncementModal = handleAnnouncementModal;
const discord_js_1 = require("discord.js");
async function handleAnnouncementModal(interaction) {
    if (!interaction.customId.startsWith('announcement_modal_'))
        return;
    // Extraemos el ID del canal desde el customId (announcement_modal_ID)
    const channelId = interaction.customId.replace('announcement_modal_', '');
    const targetChannel = interaction.guild?.channels.cache.get(channelId);
    if (!targetChannel) {
        await interaction.reply({
            content: '❌ No se pudo encontrar el canal seleccionado para enviar el anuncio.',
            ephemeral: true,
        });
        return;
    }
    const title = interaction.fields.getTextInputValue('announcement_title');
    const description = interaction.fields.getTextInputValue('announcement_description');
    const imageUrl = interaction.fields.getTextInputValue('announcement_image');
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#ff9900')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({
        text: 'El Deseo Origins • Anuncio Oficial',
        iconURL: interaction.guild?.iconURL() || undefined,
    });
    if (imageUrl && imageUrl.trim().length > 0) {
        embed.setImage(imageUrl.trim());
    }
    try {
        await targetChannel.send({
            content: '@everyone',
            embeds: [embed],
        });
        await interaction.reply({
            content: `✅ Anuncio publicado correctamente en ${targetChannel}.`,
            ephemeral: true,
        });
    }
    catch (error) {
        console.error('Error al publicar el anuncio:', error);
        await interaction.reply({
            content: '❌ Ocurrió un error al intentar enviar el anuncio al canal especificado.',
            ephemeral: true,
        });
    }
}
