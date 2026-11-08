import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits, ChannelType } from 'discord.js';
import { config } from './config';

const commands = [
  new SlashCommandBuilder()
    .setName('xelping')
    .setDescription('Comando de prueba exclusivo de XelcoreOficial')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('sugerencia')
    .setDescription('Envía una sugerencia o idea para la comunidad o servidores de ARK')
    .toJSON(),

  new SlashCommandBuilder()
    .setName('testwelcome')
    .setDescription('Simula la llegada de un nuevo usuario')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('setup-tickets')
    .setDescription('Despliega el panel principal de soporte por tickets en el canal actual')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('setup-estado')
    .setDescription('Despliega el panel de estado del servidor en tiempo real')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .toJSON(),

  new SlashCommandBuilder()
    .setName('anuncio')
    .setDescription('Abre un formulario para enviar un anuncio oficial en formato Embed')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
      option
        .setName('canal')
        .setDescription('Selecciona el canal donde se publicará el anuncio')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .toJSON(),
];

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log('🔄 Registrando comandos Slash de forma global...');
    
    // Cambiado a registro global para evitar el error 50001 (Missing Access) por Guild ID
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );
    
    console.log('✅ ¡Comandos registrados con éxito globalmente!');
  } catch (error) {
    console.error('❌ Error al registrar comandos:', error);
  }
})();