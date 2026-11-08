import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js';
import { handleGuildMemberAdd } from '../events/guildMemberAdd';

export const data = new SlashCommandBuilder()
  .setName('testwelcome')
  .setDescription('Simula la llegada de un nuevo usuario para probar el Embed de bienvenida')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator); // Solo administradores pueden probarlo

export async function execute(interaction: ChatInputCommandInteraction) {
  // Verificamos que se ejecute en un servidor
  if (!interaction.guild || !interaction.member) {
    return interaction.reply({
      content: '❌ Este comando solo se puede usar dentro de un servidor.',
      ephemeral: true,
    });
  }

  await interaction.reply({
    content: '🔄 Simulando evento de bienvenida...',
    ephemeral: true,
  });

  // Forzamos el evento pasándole el miembro que ejecuta el comando
  const member = await interaction.guild.members.fetch(interaction.user.id);
  await handleGuildMemberAdd(member);
}