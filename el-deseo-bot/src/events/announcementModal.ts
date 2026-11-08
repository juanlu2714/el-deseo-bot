import { ModalSubmitInteraction, EmbedBuilder, TextChannel } from 'discord.js';

export async function handleAnnouncementModal(interaction: ModalSubmitInteraction) {
  // Comprobamos que el customId empiece por el prefijo dinámico
  if (!interaction.customId.startsWith('announcement_modal_')) return;

  // Extraemos el ID del canal seleccionado en el comando slash
  const channelId = interaction.customId.replace('announcement_modal_', '');
  const channel = interaction.guild?.channels.cache.get(channelId) as TextChannel;

  if (!channel) {
    return interaction.reply({
      content: '❌ No se ha encontrado el canal de destino seleccionado.',
      ephemeral: true,
    });
  }

  const title = interaction.fields.getTextInputValue('announcement_title');
  const description = interaction.fields.getTextInputValue('announcement_description');
  const imageUrl = interaction.fields.getTextInputValue('announcement_image');

  // Construimos el Embed profesional
  const embed = new EmbedBuilder()
    .setColor('#ff9900') // Color naranja / dorado corporativo
    .setTitle(title)
    .setDescription(description)
    .setFooter({
      text: `Publicado por ${interaction.user.username} | El Deseo`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  if (imageUrl && imageUrl.startsWith('http')) {
    embed.setImage(imageUrl);
  }

  try {
    // Enviamos el embed al canal dinámico
    await channel.send({
      content: '@everyone', // Cambia a '@here' o elimínalo si no deseas mención global
      embeds: [embed],
    });

    // Respondemos al admin de forma privada
    await interaction.reply({
      content: `✅ Anuncio publicado correctamente en <#${channelId}>.`,
      ephemeral: true,
    });
  } catch (error) {
    console.error('Error al enviar el anuncio:', error);
    await interaction.reply({
      content: `❌ Ocurrió un error al intentar publicar en <#${channelId}>. Verifica que el bot tenga permisos suficientes.`,
      ephemeral: true,
    });
  }
}