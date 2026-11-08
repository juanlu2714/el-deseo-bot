import { ModalSubmitInteraction, EmbedBuilder, TextChannel } from 'discord.js';
import { config } from '../config';

export async function handleAnnouncementModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== 'announcement_modal') return;

  const title = interaction.fields.getTextInputValue('announcement_title');
  const description = interaction.fields.getTextInputValue('announcement_description');
  const imageUrl = interaction.fields.getTextInputValue('announcement_image');

  // Obtenemos el canal de anuncios
  const channel = interaction.guild?.channels.cache.get(config.announcementsChannelId) as TextChannel;

  if (!channel) {
    return interaction.reply({
      content: '❌ No se ha encontrado el canal de anuncios configurado.',
      ephemeral: true,
    });
  }

  // Construimos el Embed profesional
  const embed = new EmbedBuilder()
    .setColor('#ff9900') // Color naranja / dorado corporativo
    .setTitle(title)
    .setDescription(description)
    .setFooter({
      text: `Publicado por ${interaction.user.username} • El Deseo`,
      iconURL: interaction.user.displayAvatarURL(),
    })
    .setTimestamp();

  if (imageUrl && imageUrl.startsWith('http')) {
    embed.setImage(imageUrl);
  }

  // Enviamos el embed al canal de anuncios
  await channel.send({
    content: '@everyone', // Cambia a '@here' o quítalo si no quieres mención global
    embeds: [embed],
  });

  // Respondemos al admin de forma privada
  await interaction.reply({
    content: `✅ Anuncio publicado correctamente en <#${config.announcementsChannelId}>.`,
    ephemeral: true,
  });
}