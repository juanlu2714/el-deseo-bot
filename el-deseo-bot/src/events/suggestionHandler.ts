import {
  ModalSubmitInteraction,
  ButtonInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { config } from '../config';

// 1. Manejo del Modal enviando la sugerencia al Canal del Staff
export async function handleSuggestionModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== 'suggestion_modal') return;

  const title = interaction.fields.getTextInputValue('suggestion_title');
  const description = interaction.fields.getTextInputValue('suggestion_description');

  const staffChannel = interaction.guild?.channels.cache.get(
    config.suggestionsStaffChannelId
  ) as TextChannel;

  if (!staffChannel) {
    return interaction.reply({
      content: '❌ No se encontró el canal de revisión del Staff.',
      ephemeral: true,
    });
  }

  const staffEmbed = new EmbedBuilder()
    .setColor('#e67e22') // Naranja para "Pendiente"
    .setTitle(`📥 Nueva Sugerencia: ${title}`)
    .setDescription(description)
    .addFields(
      { name: '👤 Usuario', value: `${interaction.user} (${interaction.user.tag})`, inline: true },
      { name: '📌 Estado', value: '⏳ **Pendiente de revisión**', inline: true }
    )
    .setFooter({ text: `ID Usuario: ${interaction.user.id}` })
    .setTimestamp();

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`approve_suggestion_${interaction.user.id}`)
      .setLabel('Aprobar y Publicar')
      .setStyle(ButtonStyle.Success)
      .setEmoji('✅'),
    new ButtonBuilder()
      .setCustomId(`reject_suggestion_${interaction.user.id}`)
      .setLabel('Rechazar')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('❌')
  );

  await staffChannel.send({
    embeds: [staffEmbed],
    components: [buttons],
  });

  await interaction.reply({
    content: '✅ Tu sugerencia ha sido enviada al equipo del Staff para su revisión. ¡Muchas gracias!',
    ephemeral: true,
  });
}

// 2. Manejo de las acciones del Staff (Aprobar o Solicitar Motivo de Rechazo)
export async function handleSuggestionButtons(interaction: ButtonInteraction) {
  if (
    !interaction.customId.startsWith('approve_suggestion_') &&
    !interaction.customId.startsWith('reject_suggestion_')
  ) {
    return;
  }

  const isApprove = interaction.customId.startsWith('approve_suggestion_');
  const originalEmbed = interaction.message.embeds[0];
  if (!originalEmbed) return;

  const title = originalEmbed.title?.replace('📥 Nueva Sugerencia: ', '') || 'Sugerencia';
  const description = originalEmbed.description || '';
  const authorMention = originalEmbed.fields[0]?.value || 'Anónimo';

  if (isApprove) {
    // APROBAR: Publicar en canal público
    const publicChannel = interaction.guild?.channels.cache.get(
      config.suggestionsPublicChannelId
    ) as TextChannel;

    if (publicChannel) {
      const publicEmbed = new EmbedBuilder()
        .setColor('#2ecc71') // Verde
        .setTitle(`💡 Sugerencia: ${title}`)
        .setDescription(description)
        .addFields({ name: 'Enviada por', value: authorMention })
        .setFooter({ text: 'El Deseo • Sistema de Sugerencias' })
        .setTimestamp();

      const voteButtons = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('vote_yes')
          .setLabel('A favor')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('👍'),
        new ButtonBuilder()
          .setCustomId('vote_no')
          .setLabel('En contra')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('👎')
      );

      await publicChannel.send({
        embeds: [publicEmbed],
        components: [voteButtons],
      });
    }

    // Actualizar mensaje en el canal del Staff
    const updatedStaffEmbed = EmbedBuilder.from(originalEmbed)
      .setColor('#2ecc71')
      .spliceFields(1, 1, {
        name: '📌 Estado',
        value: `✅ **Aprobada por ${interaction.user.username}**`,
        inline: true,
      });

    await interaction.update({
      embeds: [updatedStaffEmbed],
      components: [],
    });
  } else {
    // RECHAZAR: Abrir ventana Modal para solicitar el motivo
    const modal = new ModalBuilder()
      .setCustomId(`reject_modal_${interaction.message.id}`)
      .setTitle('Motivo del Rechazo');

    const reasonInput = new TextInputBuilder()
      .setCustomId('reject_reason')
      .setLabel('Motivo por el que se rechaza')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Ej: Incompatible con el equilibrio actual del servidor / Ya existe una función similar.')
      .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
}

// 3. Manejo del Modal cuando el Staff escribe el Motivo del Rechazo
export async function handleRejectModal(interaction: ModalSubmitInteraction) {
  if (!interaction.customId.startsWith('reject_modal_')) return;

  const messageId = interaction.customId.replace('reject_modal_', '');
  const reason = interaction.fields.getTextInputValue('reject_reason');

  const staffMessage = await interaction.channel?.messages.fetch(messageId);
  if (!staffMessage) return;

  const originalEmbed = staffMessage.embeds[0];
  if (!originalEmbed) return;

  const title = originalEmbed.title?.replace('📥 Nueva Sugerencia: ', '') || 'Sugerencia';
  const description = originalEmbed.description || '';
  const authorMention = originalEmbed.fields[0]?.value || 'Anónimo';

  // 1. Publicar en el canal público la sugerencia RECHAZADA con su motivo
  const publicChannel = interaction.guild?.channels.cache.get(
    config.suggestionsPublicChannelId
  ) as TextChannel;

  if (publicChannel) {
    const publicRejectEmbed = new EmbedBuilder()
      .setColor('#e74c3c') // Rojo
      .setTitle(`❌ Sugerencia Rechazada: ${title}`)
      .setDescription(description)
      .addFields(
        { name: 'Enviada por', value: authorMention, inline: true },
        { name: '💬 Motivo del Rechazo', value: reason, inline: false }
      )
      .setFooter({ text: `Rechazada por ${interaction.user.username} • El Deseo` })
      .setTimestamp();

    await publicChannel.send({
      embeds: [publicRejectEmbed],
    });
  }

  // 2. Actualizar el mensaje en el canal del Staff
  const updatedStaffEmbed = EmbedBuilder.from(originalEmbed)
    .setColor('#e74c3c')
    .spliceFields(1, 1, {
      name: '📌 Estado',
      value: `❌ **Rechazada por ${interaction.user.username}**`,
      inline: true,
    })
    .addFields({ name: '💬 Motivo', value: reason });

  await staffMessage.edit({
    embeds: [updatedStaffEmbed],
    components: [],
  });

  await interaction.reply({
    content: '✅ La sugerencia ha sido rechazada y publicada con el motivo en el canal público.',
    ephemeral: true,
  });
}