"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("./config");
const rest = new discord_js_1.REST().setToken(config_1.config.token);
(async () => {
    try {
        console.log('🧹 Limpiando todos los comandos globales de la aplicación...');
        await rest.put(discord_js_1.Routes.applicationCommands(config_1.config.clientId), { body: [] });
        console.log('✅ ¡Comandos globales borrados!');
        console.log('🧹 Limpiando comandos de la Guild ID configurada...');
        await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.config.clientId, config_1.config.guildId), { body: [] });
        console.log('✅ ¡Comandos de la Guild borrados con éxito!');
    }
    catch (error) {
        console.error('❌ Error al limpiar:', error);
    }
})();
