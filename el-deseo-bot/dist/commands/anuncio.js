"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Envía un anuncio con título y descripción a cualquier canal')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
    .addChannelOption(option => option
    .setName('canal')
    .setDescription('Canal de texto donde se enviará el anuncio')
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(true))
    .addStringOption(option => option
    .setName('titulo')
    .setDescription('Título principal del anuncio')
    .setRequired(true))
    .addStringOption(option => option
    .setName('descripcion')
    .setDescription('Contenido o texto del anuncio')
    .setRequired(true))
    .addStringOption(option => option
    .setName('imagen')
    .setDescription('URL de una imagen opcional para el anuncio')
    .setRequired(false));
async function execute(interaction) {
    const channel = interaction.options.getChannel('canal', true);
    const title = interaction.options.getString('titulo', true);
    const description = interaction.options.getString('descripcion', true);
    const imageUrl = interaction.options.getString('imagen');
    if (!channel || channel.type !== discord_js_1.ChannelType.GuildText) {
        await interaction.reply({
            content: '❌ Por favor, selecciona un canal de texto válido.',
            ephemeral: true,
        });
        return;
    }
    const embed = new discord_js_1.EmbedBuilder()
        .setColor('#ff9900')
        .setTitle(title)
        .setDescription(description.replace(/\\n/g, '\n')) // Permite saltos de línea si escribes \n
        .setTimestamp()
        .setFooter({
        text: `Anuncio oficial • ${interaction.guild?.name || 'Servidor'}`,
        iconURL: interaction.guild?.iconURL() || undefined,
    });
    if (imageUrl) {
        embed.setImage(imageUrl);
    }
    try {
        await channel.send({
            content: '@everyone', // Puedes quitar esto si no quieres que mencione a todos
            embeds: [embed],
        });
        await interaction.reply({
            content: `✅ ¡Anuncio enviado correctamente a ${channel}!`,
            ephemeral: true,
        });
    }
    catch (error) {
        console.error('Error al enviar el anuncio:', error);
        await interaction.reply({
            content: '❌ Hubo un error al intentar enviar el anuncio al canal seleccionado.',
            ephemeral: true,
        });
    }
}
