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
  .setDescription('Abre un formulario para enviar un anuncio oficial a cualquier canal')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  // Añadimos la opción para elegir el canal directamente al escribir el comando
  .addChannelOption(option =>
    option
      .setName('canal')
      .setDescription('Selecciona el canal donde quieres publicar el anuncio')
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  // Obtenemos el canal que el administrador seleccionó en el comando
  const canalDestino = interaction.options.getChannel('canal', true);

  // Guardamos el ID del canal dentro del customId del modal para recuperarlo al enviar
  const modal = new ModalBuilder()
    .setCustomId(`announcement_modal_${canalDestino.id}`)
    .setTitle('Redactar Anuncio Oficial');

  // Campo: Título
  const titleInput = new TextInputBuilder()
    .setCustomId('announcement_title')
    .setLabel('Título del Anuncio')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('Ej: 📢 Apertura de El Deseo Origins - Ragnarok x3')
    .setRequired(true)
    .setMaxLength(256);

  // Campo: Mensaje / Contenido
  const descriptionInput = new TextInputBuilder()
    .setCustomId('announcement_description')
    .setLabel('Contenido del Anuncio')
    .setStyle(TextInputStyle.Paragraph)
    .setPlaceholder('Escribe aquí el cuerpo del anuncio. Puedes usar Markdown.')
    .setRequired(true);

  // Campo opcional: URL de Imagen o Banner
  const imageInput = new TextInputBuilder()
    .setCustomId('announcement_image')
    .setLabel('URL de Imagen / Banner (Opcional)')
    .setStyle(TextInputStyle.Short)
    .setPlaceholder('https://ejemplo.com/banner.png')
    .setRequired(false);

  // Añadimos cada input a su respectiva fila
  const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput);
  const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(descriptionInput);
  const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(imageInput);

  modal.addComponents(row1, row2, row3);

  // Mostramos el modal al usuario
  await interaction.showModal(modal);
}