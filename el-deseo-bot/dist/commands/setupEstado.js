"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const statusHandler_1 = require("../events/statusHandler");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('setup-estado')
    .setDescription('Despliega el panel de estado del servidor en tiempo real')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
async function execute(interaction) {
    const channel = interaction.channel;
    const initialEmbed = new discord_js_1.EmbedBuilder()
        .setColor('#00ffcc')
        .setTitle('🔄 Cargando estado del servidor...')
        .setDescription('El bot está obteniendo la información en tiempo real...')
        .setTimestamp();
    await interaction.reply({
        content: '✅ Panel de estado creado con éxito.',
        flags: discord_js_1.MessageFlags.Ephemeral,
    });
    const sentMessage = await channel.send({ embeds: [initialEmbed] });
    (0, statusHandler_1.setStatusMessageConfig)(channel.id, sentMessage.id, interaction.client);
}
