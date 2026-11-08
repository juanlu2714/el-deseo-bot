"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const commands = [
    new discord_js_1.SlashCommandBuilder()
        .setName('xelping')
        .setDescription('Comando de prueba exclusivo de XelcoreOficial')
        .toJSON(),
    new discord_js_1.SlashCommandBuilder()
        .setName('sugerencia')
        .setDescription('Envía una sugerencia o idea para la comunidad o servidores de ARK')
        .toJSON(),
    new discord_js_1.SlashCommandBuilder()
        .setName('testwelcome')
        .setDescription('Simula la llegada de un nuevo usuario')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .toJSON(),
    new discord_js_1.SlashCommandBuilder()
        .setName('setup-tickets')
        .setDescription('Despliega el panel principal de soporte por tickets en el canal actual')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .toJSON(),
    new discord_js_1.SlashCommandBuilder()
        .setName('setup-estado')
        .setDescription('Despliega el panel de estado del servidor en tiempo real')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .toJSON(),
    new discord_js_1.SlashCommandBuilder()
        .setName('anuncio')
        .setDescription('Abre un formulario para enviar un anuncio oficial en formato Embed')
        .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator)
        .addChannelOption(option => option
        .setName('canal')
        .setDescription('Selecciona el canal donde se publicará el anuncio')
        .addChannelTypes(discord_js_1.ChannelType.GuildText)
        .setRequired(true))
        .toJSON(),
];
const rest = new discord_js_1.REST().setToken(config_1.config.token);
(async () => {
    try {
        // 1. Intentamos vaciar la cache del servidor (Guild) silenciosamente
        console.log('🧹 Intentando eliminar comandos antiguos del servidor...');
        try {
            await rest.put(`/applications/${config_1.config.clientId}/guilds/${config_1.config.guildId}/commands`, { body: [] });
            console.log('✅ Comandos antiguos del servidor eliminados.');
        }
        catch (e) {
            console.log('⚠️ No se pudieron borrar vía Guild API (continuando con despliegue global)...');
        }
        // 2. Desplegamos únicamente los comandos globales actualizados
        console.log('🔄 Registrando comandos Slash Globales...');
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.clientId), { body: commands });
        console.log('✅ ¡Comandos registrados con éxito globalmente!');
    }
    catch (error) {
        console.error('❌ Error general al registrar comandos:', error);
    }
})();
