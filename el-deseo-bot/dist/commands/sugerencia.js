"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('sugerencia')
    .setDescription('Envía una sugerencia o idea para la comunidad o servidores de ARK');
async function execute(interaction) {
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId('suggestion_modal')
        .setTitle('Enviar Sugerencia - El Deseo');
    const titleInput = new discord_js_1.TextInputBuilder()
        .setCustomId('suggestion_title')
        .setLabel('Título corto de tu sugerencia')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setPlaceholder('Ej: Ajustar los multiplicadores del clúster de ARK')
        .setRequired(true)
        .setMaxLength(100);
    const descriptionInput = new discord_js_1.TextInputBuilder()
        .setCustomId('suggestion_description')
        .setLabel('Explicación detallada')
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setPlaceholder('Explica detalladamente tu propuesta y por qué beneficiaría a la comunidad.')
        .setRequired(true);
    const row1 = new discord_js_1.ActionRowBuilder().addComponents(titleInput);
    const row2 = new discord_js_1.ActionRowBuilder().addComponents(descriptionInput);
    modal.addComponents(row1, row2);
    await interaction.showModal(modal);
}
