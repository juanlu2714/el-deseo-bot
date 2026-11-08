import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('sugerencia')
  .setDescription('Envía una sugerencia o idea para la comunidad o servidores de ARK');

export async function execute(interaction: ChatInputCommandInteraction) {
  const modal = new ModalBuilder()
    .setCustomId('suggestion_modal')
    .setTitle('Enviar Sugerencia - El Deseo');

  const titleInput = new TextInputBuilder()
    .setCustomId('suggestion_title')
    .setLabel('Título corto de tu sugerencia')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: Ajustar los multiplicadores del clúster de ARK')
    .setRequired(true)
    .setMaxLength(100);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('suggestion_description')
    .setLabel('Explicación detallada')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Explica detalladamente tu propuesta y por qué beneficiaría a la comunidad.')
    .setRequired(true);

  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);

  modal.addComponents(row1, row2);

  await interaction.showModal(modal);
}