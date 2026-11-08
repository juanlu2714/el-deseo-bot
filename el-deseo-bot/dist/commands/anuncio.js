"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Abre un formulario para enviar un anuncio oficial en formato Embed')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addChannelOption(option => option
    .setName('canal')
    .setDescription('Selecciona el canal donde se publicará el anuncio')
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(true));
async function execute(interaction) {
    const selectedChannel = interaction.options.getChannel('canal', true);
    const modal = new discord_js_1.ModalBuilder()
        .setCustomId(`announcement_modal_${selectedChannel.id}`)
        .setTitle('Nuevo Anuncio Oficial');
    const titleInput = new discord_js_1.TextInputBuilder()
        .setCustomId('announcement_title')
        .setLabel('Título del anuncio')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(true);
    const descriptionInput = new discord_js_1.TextInputBuilder()
        .setCustomId('announcement_description')
        .setLabel('Contenido del anuncio')
        .setStyle(discord_js_1.TextInputStyle.Paragraph)
        .setRequired(true);
    const imageInput = new discord_js_1.TextInputBuilder()
        .setCustomId('announcement_image')
        .setLabel('URL de la imagen (Opcional)')
        .setStyle(discord_js_1.TextInputStyle.Short)
        .setRequired(false);
    modal.addComponents(new discord_js_1.ActionRowBuilder().addComponents(titleInput), new discord_js_1.ActionRowBuilder().addComponents(descriptionInput), new discord_js_1.ActionRowBuilder().addComponents(imageInput));
    await interaction.showModal(modal);
}
