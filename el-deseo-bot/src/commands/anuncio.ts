import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
  ChannelType,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('anuncio')
  .setDescription('Abre un formulario para enviar un anuncio oficial en formato Embed')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addChannelOption(option =>
    option
      .setName('canal')
      .setDescription('Selecciona el canal donde se publicará el anuncio')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Obtenemos el canal seleccionado dinámicamente por el usuario
  const selectedChannel = interaction.options.getChannel('canal', true);

  // Le pasamos el ID del canal elegido dentro del customId del modal
  const modal = new ModalBuilder()
    .setCustomId(`announcement_modal_${selectedChannel.id}`)
    .setTitle('Nuevo Anuncio Oficial');

  const titleInput = new TextInputBuilder()
    .setCustomId('announcement_title')
    .setLabel('Título del anuncio')
    .setStyle(TextInputStyle.Short)
    .setRequired(true);

  const descriptionInput = new TextInputBuilder()
    .setCustomId('announcement_description')
    .setLabel('Contenido del anuncio')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true);

  const imageInput = new TextInputBuilder()
    .setCustomId('announcement_image')
    .setLabel('URL de la imagen (Opcional)')
    .setStyle(TextInputStyle.Short)
    .setRequired(false);

  modal.addComponents(
    new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput),
    new ActionRowBuilder<TextInputBuilder>().addComponents(imageInput)
  );

  await interaction.showModal(modal);
}