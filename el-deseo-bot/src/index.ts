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
import {
  handleSuggestionModal,
  handleSuggestionButtons,
  handleRejectModal,
} from './events/suggestionHandler';
import { handleSuggestionMessage } from './events/suggestionMessageHandler';
import { handleTicketButtons, handleTicketSelectMenu } from './events/ticketHandler';
import { handleAutoMod } from './events/automodHandler';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,    // Para detectar cuando escriben en los canales
    GatewayIntentBits.MessageContent,   // Para leer el contenido de los mensajes (AutoMod y Sugerencias)
  ],
});

// Evento de inicio del bot
client.once('clientReady', () => {
  console.log(`[BOT] ¡Conectado con éxito como ${client.user?.tag}!`);
  
  // Inicia el actualizador de estado en tiempo real
  startStatusUpdater(client);
});

// 1. Evento de bienvenida real
client.on('guildMemberAdd', handleGuildMemberAdd);

// 2. Procesamiento de mensajes de texto (AutoMod primero, luego Sugerencias)
client.on('messageCreate', async (message) => {
  await handleAutoMod(message);
  await handleSuggestionMessage(message);
});

// 3. Manejador central de interacciones (Slash, Modals, Botones y Menús Desplegables)
client.on('interactionCreate', async (interaction) => {
  // --- A. COMANDOS SLASH ---
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

  // --- B. FORMULARIOS EMERGENTES (MODALS) ---
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'announcement_modal') {
      await handleAnnouncementModal(interaction);
    } else if (interaction.customId === 'suggestion_modal') {
      await handleSuggestionModal(interaction);
    } else if (interaction.customId.startsWith('reject_modal_')) {
      await handleRejectModal(interaction);
    }
  }

  // --- C. BOTONES INTERACTIVOS ---
  if (interaction.isButton()) {
    await handleSuggestionButtons(interaction);
    await handleTicketButtons(interaction);
  }

  // --- D. MENÚS DESPLEGABLES (SELECT MENUS) ---
  if (interaction.isStringSelectMenu()) {
    await handleTicketSelectMenu(interaction);
  }
});

client.login(config.token);