import {
  ButtonInteraction,
  StringSelectMenuInteraction,
  ChannelType,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextChannel,
  MessageFlags,
} from 'discord.js';
import { config } from '../config';

// 1. MANEJO DE BOTONES (Abrir panel selector o Cerrar Ticket)
export async function handleTicketButtons(interaction: ButtonInteraction) {
  const { customId, guild, user } = interaction;

  // A. Pulsan "Abrir Ticket" -> Mostrar Menú Desplegable
  if (customId === 'open_ticket') {
    if (!guild) return;

    // Verificar si ya tiene un ticket abierto
    const cleanUsername = user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingChannel = guild.channels.cache.find((ch) =>
      ch.name.startsWith(`ticket-${cleanUsername}`)
    );

    if (existingChannel) {
      return interaction.reply({
        content: `❌ Ya tienes un ticket abierto en <#${existingChannel.id}>.`,
        flags: MessageFlags.Ephemeral,
      });
    }

    // Crear el Menú Desplegable de Categorías
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ticket_category_select')
      .setPlaceholder('Selecciona el motivo de tu consulta...')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Reporte de Jugador')
          .setDescription('Reporta trampas, robos o infracciones de normas')
          .setValue('reporte')
          .setEmoji('🚨'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Bugs y Errores')
          .setDescription('Fallos en el mapa, pérdidas por bugs o exploits')
          .setValue('bug')
          .setEmoji('🐛'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Comprar VIP / Rangos')
          .setDescription('Dudas sobre donaciones, tienda o entregas VIP')
          .setValue('vip')
          .setEmoji('💎'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Partner y Creadores')
          .setDescription('Alianzas, streamers, creadores de contenido o TikTok')
          .setValue('partner')
          .setEmoji('🤝'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Soporte General')
          .setDescription('Dudas generales sobre el clúster o el servidor')
          .setValue('general')
          .setEmoji('❓')
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

    await interaction.reply({
      content: '📌 **Por favor, selecciona la categoría que mejor describa tu consulta:**',
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }

  // B. Pulsan "Cerrar Ticket"
  if (customId === 'close_ticket') {
    const channel = interaction.channel as TextChannel;
    if (!channel) return;

    await interaction.reply({
      content: '🔒 El ticket se cerrará y eliminará en 5 segundos...',
    });

    setTimeout(async () => {
      try {
        await channel.delete();
      } catch (error) {
        console.error('Error al eliminar el canal de ticket:', error);
      }
    }, 5000);
  }
}

// 2. MANEJO DEL MENÚ DESPLEGABLE (Creación del canal según opción seleccionada)
export async function handleTicketSelectMenu(interaction: StringSelectMenuInteraction) {
  if (interaction.customId !== 'ticket_category_select') return;

  const { guild, user, values } = interaction;
  if (!guild) return;

  const selectedCategory = values[0]; // Categoría elegida

  // Mapa de nombres y emoticonos para personalizar el ticket
  const categoryDetails: Record<string, { name: string; emoji: string; desc: string }> = {
    reporte: {
      name: 'reporte',
      emoji: '🚨',
      desc: 'Proporciona nombres de los implicados, horas y capturas/vídeos si dispones de ellos.',
    },
    bug: {
      name: 'bug',
      emoji: '🐛',
      desc: 'Explica detalladamente qué estabas haciendo cuando ocurrió el bug y qué objetos/dinos se vieron afectados.',
    },
    vip: {
      name: 'vip',
      emoji: '💎',
      desc: 'Indica el paquete o rango deseado o adjunta el comprobante de donación/transacción.',
    },
    partner: {
      name: 'partner',
      emoji: '🤝',
      desc: 'Indica tu canal (Twitch, YouTube, TikTok) y la propuesta de colaboración o número de seguidores.',
    },
    general: {
      name: 'general',
      emoji: '❓',
      desc: 'Describe detalladamente tu duda o problema para que podamos asistirte.',
    },
  };

  const details = categoryDetails[selectedCategory] || categoryDetails.general;

  await interaction.deferUpdate();

  try {
    const cleanUsername = user.username.toLowerCase().replace(/[^a-z0-9]/g, '');
    const channelName = `ticket-${details.name}-${cleanUsername || user.id}`;

    // Configuración de permisos
    const permissionOverwrites: any[] = [
      {
        id: guild.id, // Oculto para @everyone
        deny: [PermissionFlagsBits.ViewChannel],
      },
      {
        id: user.id, // El usuario puede verlo
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      },
    ];

    if (config.staffRoleId) {
      permissionOverwrites.push({
        id: config.staffRoleId,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.AttachFiles,
          PermissionFlagsBits.ReadMessageHistory,
        ],
      });
    }

    const parentId =
      config.ticketsCategoryId && config.ticketsCategoryId.trim() !== ''
        ? config.ticketsCategoryId
        : undefined;

    // Crear canal del ticket
    const ticketChannel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      parent: parentId,
      permissionOverwrites,
    });

    const ticketEmbed = new EmbedBuilder()
      .setColor('#2ecc71')
      .setTitle(`${details.emoji} Ticket de Soporte: ${selectedCategory.toUpperCase()} - ${user.username}`)
      .setDescription(
        `¡Hola ${user}! Gracias por contactar con el soporte de **El Deseo**.\n\n` +
        `**Categoría:** ${details.emoji} **${selectedCategory.toUpperCase()}**\n` +
        `📌 **Instrucciones:** ${details.desc}\n\n` +
        `Un miembro del Staff te responderá muy pronto.`
      )
      .setFooter({ text: 'Para cerrar este ticket, pulsa el botón de abajo.' })
      .setTimestamp();

    const closeButton = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId('close_ticket')
        .setLabel('Cerrar Ticket')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔒')
    );

    const staffMention = config.staffRoleId ? `<@&${config.staffRoleId}>` : '';

    await ticketChannel.send({
      content: `${user} ${staffMention}`.trim(),
      embeds: [ticketEmbed],
      components: [closeButton],
    });

    // Actualizar la respuesta efímera confirmando la apertura
    await interaction.editReply({
      content: `✅ Ticket creado con éxito en <#${ticketChannel.id}>.`,
      components: [], // Eliminamos el desplegable de la vista efímera
    });
  } catch (error) {
    console.error('Error al crear el ticket desde el desplegable:', error);
    await interaction.editReply({
      content: '❌ Ocurrió un error al intentar crear el canal del ticket.',
      components: [],
    });
  }
}