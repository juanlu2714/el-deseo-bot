import { Client, GatewayIntentBits, MessageFlags, REST, Routes } from 'discord.js';
import { config } from './config';
import { handleGuildMemberAdd } from './events/guildMemberAdd';
import { execute as executeTestWelcome } from './commands/testwelcome';
import { execute as executeAnuncio, data as anuncioData } from './commands/anuncio';
import { execute as executeSugerencia } from './commands/sugerencia';
import { execute as executeSetupTickets } from './commands/setupTickets';
import { execute as executeSetupEstado } from './commands/setupEstado';
import { executeGiveaway } from './commands/giveaway';
import { startStatusUpdater } from './events/statusHandler';
import { handleSuggestionMessage } from './events/suggestionMessageHandler';
import { handleTicketButtons, handleTicketSelectMenu } from './events/ticketHandler';
import { handleAutoMod } from './events/automodHandler';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Evento de inicio del bot y registro de comandos
client.once('clientReady', async () => {
    console.log(`[BOT] ¡Conectado con éxito como ${client.user?.tag}!`);
    startStatusUpdater(client);

    // Registro forzado del nuevo comando /anuncio en la API de Discord
    const rest = new REST({ version: '10' }).setToken(config.token);
    try {
        console.log('[BOT] Actualizando comandos de barra en Discord...');
        await rest.put(
            Routes.applicationCommands(client.user!.id),
            { body: [anuncioData.toJSON()] },
        );
        console.log('[BOT] ¡Comando /anuncio actualizado correctamente en Discord!');
    } catch (error) {
        console.error('[BOT] Error al registrar comandos:', error);
    }
});

// 1. Evento de bienvenida real
client.on('guildMemberAdd', handleGuildMemberAdd);

// 2. Procesamiento de mensajes de texto (AutoMod primero, luego Sugerencias)
client.on('messageCreate', async (message) => {
    await handleAutoMod(message);
    await handleSuggestionMessage(message);
});

// 3. Manejador central de interacciones (Slash commands, Botones y Menús Desplegables)
client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'xelping') {
            const ping = client.ws.ping;
            await interaction.reply({
                content: `🏓 ¡Pong de **XelcoreOficial**! Latencia: \`${ping}ms\``,
                flags: MessageFlags.Ephemeral,
            });
        } else if (interaction.commandName === 'testwelcome') {
            await executeTestWelcome(interaction);
        } else if (interaction.commandName === 'setup-estado') {
            await executeSetupEstado(interaction);
        } else if (interaction.commandName === 'anuncio') {
            await executeAnuncio(interaction);
        } else if (interaction.commandName === 'sugerencia') {
            await executeSugerencia(interaction);
        } else if (interaction.commandName === 'setup-tickets') {
            await executeSetupTickets(interaction);
        } else if (interaction.commandName === 'giveaway') {
            await executeGiveaway(interaction);
        }
    }

    if (interaction.isButton()) {
        await handleTicketButtons(interaction);
    }

    if (interaction.isStringSelectMenu()) {
        await handleTicketSelectMenu(interaction);
    }
});

client.login(config.token);