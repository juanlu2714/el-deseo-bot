import { Message, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, TextChannel } from 'discord.js';
import { config } from '../config';

export async function handleSuggestionMessage(message: Message) {
  // Ignorar mensajes enviados por bots o fuera de un servidor
  if (message.author.bot || !message.guild) return;

  // Solo actuar si el mensaje se envía en el canal público/abierto de sugerencias
  if (message.channelId !== config.suggestionsPublicChannelId) return;

  const content = message.content.trim();
  if (!content) return;

  // Borramos el mensaje de texto del usuario para mantener el canal limpio
  try {
    await message.delete();
  } catch (error) {
    console.error('No se pudo borrar el mensaje original:', error);
  }

  // Obtenemos el canal de revisión del Staff
  const staffChannel = message.guild.channels.cache.get(
    config.suggestionsStaffChannelId
  ) as TextChannel;

  if (!staffChannel) return;

  // Creamos la tarjeta para el Staff
  const staffEmbed = new EmbedBuilder()
    .setColor('#e67e22') // Naranja (Pendiente)
    .setTitle('📥 Nueva Sugerencia (Mensaje Directo)')
    .setDescription(content)
    .addFields(
      { name: '👤 Usuario', value: `${message.author} (${message.author.tag})`, inline: true },
      { name: '📌 Estado', value: '⏳ **Pendiente de revisión**', inline: true }
    )
    .setFooter({ text: `ID Usuario: ${message.author.id}` })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_suggestion_${message.author.id}`)
      .setLabel('Aprobar y Publicar')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅'),
    new ButtonBuilder()
      .setCustomId(`reject_suggestion_${message.author.id}`)
      .setLabel('Rechazar')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('❌')
  );

  await staffChannel.send({
    embeds: [staffEmbed],
    components: [buttons],
  });

  // (Opcional) Notificamos efímeramente o mediante MP al usuario si se desea
}