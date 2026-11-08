import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { config } from './config';

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log('🧹 Limpiando todos los comandos globales de la aplicación...');
    await rest.put(Routes.applicationCommands(config.clientId), { body: [] });
    console.log('✅ ¡Comandos globales borrados!');

    console.log('🧹 Limpiando comandos de la Guild ID configurada...');
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: [] });
    console.log('✅ ¡Comandos de la Guild borrados con éxito!');
  } catch (error) {
    console.error('❌ Error al limpiar:', error);
  }
})();