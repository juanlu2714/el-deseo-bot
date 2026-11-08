import { 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  EmbedBuilder, 
  TextChannel 
} from 'discord.js';

export async function sendSuggestionPanel(channel: TextChannel) {
  const embed = new EmbedBuilder()
    .setTitle('💡 Buzón de Sugerencias - El Deseo')
    .setDescription(
      '¡Queremos escuchar tus ideas para mejorar los servidores!\n\n' +
      'Haz clic en el botón de abajo para enviar tu sugerencia de forma estructurada.'
    )
    .setColor(0x00aaff)
    .setFooter({ text: 'El Deseo • Tu opinión cuenta' });

  const button = new ButtonBuilder()
    .setCustomId('btn_open_suggestion_modal')
    .setLabel('Enviar Sugerencia')
    .setEmoji('📝')
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  await channel.send({ embeds: [embed], components: [row] });
}