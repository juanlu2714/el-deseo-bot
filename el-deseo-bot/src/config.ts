import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.DISCORD_CLIENT_ID || '',
  guildId: process.env.DISCORD_GUILD_ID || '',
  welcomeChannelId: process.env.DISCORD_WELCOME_CHANNEL_ID || '',
  announcementsChannelId: process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_ID || '',
  suggestionsStaffChannelId: process.env.DISCORD_SUGGESTIONS_STAFF_CHANNEL_ID || '',
  suggestionsPublicChannelId: process.env.DISCORD_SUGGESTIONS_PUBLIC_CHANNEL_ID || '',
  ticketsCategoryId: process.env.DISCORD_TICKETS_CATEGORY_ID || '',
  staffRoleId: process.env.DISCORD_STAFF_ROLE_ID || '',
  automodBannedWords: ['palabraprohibida1', 'spamgrosero'], // Puedes personalizarlas
};