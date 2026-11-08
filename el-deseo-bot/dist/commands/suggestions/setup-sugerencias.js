"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuggestionPanel = sendSuggestionPanel;
const discord_js_1 = require("discord.js");
async function sendSuggestionPanel(channel) {
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('💡 Buzón de Sugerencias - El Deseo')
        .setDescription('¡Queremos escuchar tus ideas para mejorar los servidores!\n\n' +
        'Haz clic en el botón de abajo para enviar tu sugerencia de forma estructurada.')
        .setColor(0x00aaff)
        .setFooter({ text: 'El Deseo • Tu opinión cuenta' });
    const button = new discord_js_1.ButtonBuilder()
        .setCustomId('btn_open_suggestion_modal')
        .setLabel('Enviar Sugerencia')
        .setEmoji('📝')
        .setStyle(discord_js_1.ButtonStyle.Primary);
    const row = new discord_js_1.ActionRowBuilder().addComponents(button);
    await channel.send({ embeds: [embed], components: [row] });
}
