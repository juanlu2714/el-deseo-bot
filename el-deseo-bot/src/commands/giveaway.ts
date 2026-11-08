import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from 'discord.js';

export const giveawayCommand = new SlashCommandBuilder()
  .setName('giveaway')
  .setDescription('Crea un sorteo automático en el servidor')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addStringOption((option) =>
    option
      .setName('premio')
      .setDescription('¿Qué se va a sortear? (Ej: Rango VIP, DINO 150 Mutado, etc.)')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('duracion')
      .setDescription('Duración del sorteo (Ej: 1m, 30m, 2h, 1d)')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('ganadores')
      .setDescription('Número de ganadores (Por defecto: 1)')
      .setRequired(false)
  );

// Función auxiliar para convertir el tiempo ingresado (ej: 10m, 1h) a milisegundos
function parseDuration(durationStr: string): number | null {
  const regex = /^(\d+)([mhd])$/i;
  const match = durationStr.match(regex);
  if (!match) return null;

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'm':
      return value * 60 * 1000;
    case 'h':
      return value * 60 * 60 * 1000;
    case 'd':
      return value * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

export async function executeGiveaway(interaction: ChatInputCommandInteraction) {
  const prize = interaction.options.getString('premio', true);
  const durationStr = interaction.options.getString('duracion', true);
  const winnersCount = interaction.options.getInteger('ganadores') || 1;

  const durationMs = parseDuration(durationStr);
  if (!durationMs) {
    return interaction.reply({
      content: '❌ Formato de tiempo inválido. Usa formatos como `10m` (minutos), `2h` (horas) o `1d` (días).',
      ephemeral: true,
    });
  }

  const endTime = Math.floor((Date.now() + durationMs) / 1000);

  const giveawayEmbed = new EmbedBuilder()
    .setColor('#f1c40f')
    .setTitle(`🎉 ¡SORTEO: ${prize.toUpperCase()}! 🎉`)
    .setDescription(
      `¡Un nuevo sorteo ha comenzado en **El Deseo**!\n\n` +
      `🎁 **Premio:** ${prize}\n` +
      `👥 **Ganadores:** ${winnersCount}\n` +
      `⏳ **Finaliza:** <t:${endTime}:R> (<t:${endTime}:f>)\n\n` +
      `Pulsa el botón de abajo para participar.`
    )
    .setFooter({ text: '¡Mucha suerte a todos los participantes!' })
    .setTimestamp();

  const joinButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId('giveaway_join')
      .setLabel('🎉 Participar (0)')
      .setStyle(ButtonStyle.Primary)
  );

  await interaction.reply({ content: '✅ Sorteo iniciado correctamente.', ephemeral: true });

  const channel = interaction.channel as TextChannel;
  const giveawayMessage = await channel.send({
    embeds: [giveawayEmbed],
    components: [joinButton],
  });

  // Estructura en memoria para guardar los participantes de este sorteo
  const participants = new Set<string>();

  const collector = giveawayMessage.createMessageComponentCollector({
    time: durationMs,
  });

  collector.on('collect', async (i) => {
    if (i.customId === 'giveaway_join') {
      if (participants.has(i.user.id)) {
        participants.delete(i.user.id);
        await i.reply({ content: '❌ Has salido del sorteo.', ephemeral: true });
      } else {
        participants.add(i.user.id);
        await i.reply({ content: '🎉 ¡Te has inscrito correctamente al sorteo!', ephemeral: true });
      }

      // Actualizar el contador del botón
      const updatedButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('giveaway_join')
          .setLabel(`🎉 Participar (${participants.size})`)
          .setStyle(ButtonStyle.Primary)
      );

      await giveawayMessage.edit({ components: [updatedButton] });
    }
  });

  collector.on('end', async () => {
    const participantList = Array.from(participants);

    if (participantList.length === 0) {
      const endedEmbed = EmbedBuilder.from(giveawayEmbed)
        .setColor('#e74c3c')
        .setDescription(`❌ **Sorteo finalizado.** No hubo suficientes participantes para entregar el premio: **${prize}**.`);

      await giveawayMessage.edit({ embeds: [endedEmbed], components: [] });
      return;
    }

    // Seleccionar ganadores aleatorios
    const shuffled = participantList.sort(() => 0.5 - Math.random());
    const winners = shuffled.slice(0, Math.min(winnersCount, participantList.length));
    const winnersMentions = winners.map((id) => `<@${id}>`).join(', ');

    const winnerEmbed = EmbedBuilder.from(giveawayEmbed)
      .setColor('#2ecc71')
      .setDescription(
        `🏆 **¡SORTEO FINALIZADO!** 🏆\n\n` +
        `🎁 **Premio:** ${prize}\n` +
        `🎉 **Ganador(es):** ${winnersMentions}\n\n` +
        `¡Felicidades! Abre un ticket de soporte para reclamar tu premio.`
      );

    await giveawayMessage.edit({ embeds: [winnerEmbed], components: [] });
    await channel.send({
      content: `🎉 ¡Enhorabuena ${winnersMentions}! Has ganado el sorteo de **${prize}**.`,
    });
  });
}