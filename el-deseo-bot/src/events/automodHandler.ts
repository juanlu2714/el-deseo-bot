import { Message, PermissionFlagsBits } from 'discord.js';
import { config } from '../config';

export async function handleAutoMod(message: Message) {
  // Ignorar mensajes de bots, mensajes fuera de servidores o administradores/staff
  if (message.author.bot || !message.guild || !message.member) return;
  if (message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

  const content = message.content.toLowerCase();
  let infractionReason = '';

  // 1. FILTRO DE INVITACIONES DE DISCORD
  const discordInviteRegex = /(discord\.(gg|io|me|li)|discordapp\.com\/invite)\/.+|discord\.com\/invite\/[a-zA-Z0-9]+/gi;
  if (discordInviteRegex.test(message.content)) {
    infractionReason = 'Publicación de invitación de Discord (Spam)';
  }

  // 2. FILTRO DE MENCIONES MASIVAS (Más de 5 menciones en un solo mensaje)
  if (message.mentions.users.size + message.mentions.roles.size > 5) {
    infractionReason = 'Exceso de menciones masivas';
  }

  // 3. FILTRO DE PALABRAS PROHIBIDAS
  const bannedWords = config.automodBannedWords || [];
  const hasBannedWord = bannedWords.some((word) => content.includes(word.toLowerCase()));
  if (hasBannedWord && bannedWords.length > 0) {
    infractionReason = 'Uso de lenguaje o palabras prohibidas';
  }

  // Si se detecta alguna infracción
  if (infractionReason) {
    try {
      // Borrar el mensaje infractor
      await message.delete();

      const channel = message.channel;
      if (channel && 'send' in channel) {
        // Enviar advertencia temporal al usuario en el chat (se borra a los 5 segundos)
        const warningMsg = await channel.send(
          `⚠️ ${message.author}, tu mensaje fue eliminado por **AutoMod**: *${infractionReason}*.`
        );
        setTimeout(() => warningMsg.delete().catch(() => {}), 5000);
      }

      // Opcional: Enviar registro al canal de logs del Staff si está configurado
      if (config.announcementsChannelId) {
        // Aquí podrías notificar al staff si lo deseas
      }
    } catch (error) {
      console.error('Error al aplicar AutoMod en el mensaje:', error);
    }
  }
}