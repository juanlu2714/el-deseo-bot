import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  EmbedBuilder,
  TextChannel,
  MessageFlags,
} from 'discord.js';
import { setStatusMessageConfig } from '../events/statusHandler';

export const data = new SlashCommandBuilder()
  .setName('setup-estado')
  .setDescription('Despliega el panel de estado del servidor en tiempo real')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
  const channel = interaction.channel as TextChannel;

  const initialEmbed = new EmbedBuilder()
    .setColor('#00ffcc')
    .setTitle('🔄 Cargando estado del servidor...')
    .setDescription('El bot está obteniendo la información en tiempo real...')
    .setTimestamp();

  await interaction.reply({
    content: '✅ Panel de estado creado con éxito.',
    flags: MessageFlags.Ephemeral,
  });

  const sentMessage = await channel.send({ embeds: [initialEmbed] });
  setStatusMessageConfig(channel.id, sentMessage.id, interaction.client);
}