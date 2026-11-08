import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('setup-tickets')
  .setDescription('Despliega el panel principal de soporte por tickets en el canal actual')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const channel = interaction.channel;

  // Verificamos que el canal exista y sea apto para enviar mensajes
  if (!channel || !('send' in channel)) {
    await interaction.reply({
      content: '❌ No se ha podido determinar el canal de destino o no tengo permisos para enviar mensajes aquí.',
      ephemeral: true,
    });
    return;
  }

  const embed = new EmbedBuilder()
    .setColor('#0099ff')
    .setTitle('🎫 Centro de Soporte y Atención - El Deseo')
    .setDescription(
      '¿Necesitas ayuda con tu tribu, has detectado un problema en el servidor o quieres reportar un fallo?\n\n' +
      'Haz clic en el botón de abajo para abrir un **ticket privado** con nuestro equipo de administración.'
    )
    .addFields(
      { name: '⏰ Horario de Atención', value: 'Soporte continuo según disponibilidad del Staff.', inline: true },
      { name: '📌 Recomendación', value: 'Ten a mano las capturas o detalles de tu problema para agilizar la ayuda.', inline: true }
    )
    .setFooter({ text: 'El Deseo • Powered by Xelcore' });

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('open_ticket')
      .setLabel('Abrir Ticket de Soporte')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📩')
  );

  await channel.send({
    embeds: [embed],
    components: [row],
  });

  await interaction.reply({
    content: '✅ Panel de tickets desplegado correctamente.',
    ephemeral: true,
  });
}