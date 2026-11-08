import { Client, GatewayIntentBits, MessageFlags } from 'discord.js';
import { config } from './config';
import { handleGuildMemberAdd } from './events/guildMemberAdd';
import { execute as executeTestWelcome } from './commands/testwelcome';
import { execute as executeAnuncio } from './commands/anuncio';
import { execute as executeSugerencia } from './commands/sugerencia';
import { execute as executeSetupTickets } from './commands/setupTickets';
import { execute as executeSetupEstado } from './commands/setupEstado';
import { executeGiveaway } from './commands/giveaway';
import { startStatusUpdater } from './events/statusHandler';
import { handleAnnouncementModal } from './events/announcementModal';
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

client.once('clientReady', () => {
    console.log(`[BOT] ¡Conectado con éxito como ${client.user?.tag}!`);
    startStatusUpdater(client);
});

client.on('guildMemberAdd', handleGuildMemberAdd);

client.on('messageCreate', async (message) => {
    await handleAutoMod(message);
    await handleSuggestionMessage(message);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'xelping') {
            const ping = client.ws.ping;
            await interaction.reply({
                content: `?? ¡Pong de **XelcoreOficial**! Latencia: \`${ping}ms\``,
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

    if (interaction.isModalSubmit()) {
        if (interaction.customId.startsWith('announcement_modal_')) {
            await handleAnnouncementModal(interaction);
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
