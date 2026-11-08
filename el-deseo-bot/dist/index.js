"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const guildMemberAdd_1 = require("./events/guildMemberAdd");
const testwelcome_1 = require("./commands/testwelcome");
const anuncio_1 = require("./commands/anuncio");
const sugerencia_1 = require("./commands/sugerencia");
const setupTickets_1 = require("./commands/setupTickets");
const setupEstado_1 = require("./commands/setupEstado");
const giveaway_1 = require("./commands/giveaway");
const statusHandler_1 = require("./events/statusHandler");
const suggestionMessageHandler_1 = require("./events/suggestionMessageHandler");
const ticketHandler_1 = require("./events/ticketHandler");
const automodHandler_1 = require("./events/automodHandler");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
// Evento de inicio del bot y registro de comandos
client.once('clientReady', async () => {
    console.log(`[BOT] ¡Conectado con éxito como ${client.user?.tag}!`);
    (0, statusHandler_1.startStatusUpdater)(client);
    // Registro forzado del nuevo comando /anuncio en la API de Discord
    const rest = new discord_js_1.REST({ version: '10' }).setToken(config_1.config.token);
    try {
        console.log('[BOT] Actualizando comandos de barra en Discord...');
        await rest.put(discord_js_1.Routes.applicationCommands(client.user.id), { body: [anuncio_1.data.toJSON()] });
        console.log('[BOT] ¡Comando /anuncio actualizado correctamente en Discord!');
    }
    catch (error) {
        console.error('[BOT] Error al registrar comandos:', error);
    }
});
// 1. Evento de bienvenida real
client.on('guildMemberAdd', guildMemberAdd_1.handleGuildMemberAdd);
// 2. Procesamiento de mensajes de texto (AutoMod primero, luego Sugerencias)
client.on('messageCreate', async (message) => {
    await (0, automodHandler_1.handleAutoMod)(message);
    await (0, suggestionMessageHandler_1.handleSuggestionMessage)(message);
});
// 3. Manejador central de interacciones (Slash commands, Botones y Menús Desplegables)
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'xelping') {
            const ping = client.ws.ping;
            await interaction.reply({
                content: `🏓 ¡Pong de **XelcoreOficial**! Latencia: \`${ping}ms\``,
                flags: discord_js_1.MessageFlags.Ephemeral,
            });
        }
        else if (interaction.commandName === 'testwelcome') {
            await (0, testwelcome_1.execute)(interaction);
        }
        else if (interaction.commandName === 'setup-estado') {
            await (0, setupEstado_1.execute)(interaction);
        }
        else if (interaction.commandName === 'anuncio') {
            await (0, anuncio_1.execute)(interaction);
        }
        else if (interaction.commandName === 'sugerencia') {
            await (0, sugerencia_1.execute)(interaction);
        }
        else if (interaction.commandName === 'setup-tickets') {
            await (0, setupTickets_1.execute)(interaction);
        }
        else if (interaction.commandName === 'giveaway') {
            await (0, giveaway_1.executeGiveaway)(interaction);
        }
    }
    if (interaction.isButton()) {
        await (0, ticketHandler_1.handleTicketButtons)(interaction);
    }
    if (interaction.isStringSelectMenu()) {
        await (0, ticketHandler_1.handleTicketSelectMenu)(interaction);
    }
});
client.login(config_1.config.token);
