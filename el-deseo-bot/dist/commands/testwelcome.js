"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.data = void 0;
exports.execute = execute;
const discord_js_1 = require("discord.js");
const guildMemberAdd_1 = require("../events/guildMemberAdd");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Simula la llegada de un nuevo usuario para probar el Embed de bienvenida')
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator); // Solo administradores pueden probarlo
async function execute(interaction) {
    // Verificamos que se ejecute en un servidor
    if (!interaction.guild || !interaction.member) {
        return interaction.reply({
            content: '❌ Este comando solo se puede usar dentro de un servidor.',
            ephemeral: true,
        });
    }
    await interaction.reply({
        content: '🔄 Simulando evento de bienvenida...',
        ephemeral: true,
    });
    // Forzamos el evento pasándole el miembro que ejecuta el comando
    const member = await interaction.guild.members.fetch(interaction.user.id);
    await (0, guildMemberAdd_1.handleGuildMemberAdd)(member);
}
