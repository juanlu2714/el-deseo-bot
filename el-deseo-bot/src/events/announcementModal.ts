import { ModalSubmitInteraction, EmbedBuilder, TextChannel } from 'discord.js';

export async function handleAnnouncementModal(interaction: ModalSubmitInteraction) {
  // Verificamos que sea un modal de anuncio
  if (!interaction.customId.startsWith('announcement_modal')) return;

  // 1. Extraemos el ID del canal que viene en el customId (announcement_modal_IDDELCANAL)
  const channelId = interaction.customId.replace('announcement_modal_', '');

  // 2. Buscamos el canal objetivo en el servidor
  const targetChannel = interaction.guild?.channels.cache.get(channelId) as TextChannel;

  if (!targetChannel) {
    await interaction.reply({
      content: '❌ No se pudo encontrar el canal seleccionado para enviar el anuncio.',
      ephemeral: true,
    });
    return;
  }

  // 3. Obtenemos los valores introducidos en el modal
  const title = interaction.fields.getTextInputValue('announcement_title');
  const description = interaction.fields.getTextInputValue('announcement_description');
  const imageUrl = interaction.fields.getTextInputValue('announcement_image');

  // 4. Construimos el Embed corporativo
  const embed = new EmbedBuilder()
    .setColor('#ff9900')
    .setTitle(title)
    .setDescription(description)
    .setTimestamp()
    .setFooter({
      text: 'El Deseo Origins • Anuncio Oficial',
      iconURL: interaction.guild?.iconURL() || undefined,
    });

  if (imageUrl && imageUrl.trim().length > 0) {
    embed.setImage(imageUrl.trim());
  }

  try {
    // 5. Enviamos la mención @everyone y el Embed al canal seleccionado
    await targetChannel.send({
      content: '@everyone',
      embeds: [embed],
    });

    // 6. Confirmamos al usuario que ejecutó el comando (de forma privada/ephemeral)
    await interaction.reply({
      content: `✅ Anuncio publicado correctamente en ${targetChannel}.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error('Error al publicar el anuncio:', error);
    await interaction.reply({
      content: '❌ Ocurrió un error al intentar enviar el anuncio al canal especificado.',
      ephemeral: true,
    });
  }
}