"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatusMessage = updateStatusMessage;
exports.setStatusMessageConfig = setStatusMessageConfig;
exports.startStatusUpdater = startStatusUpdater;
const discord_js_1 = require("discord.js");
const rcon_client_1 = require("rcon-client");
const net_1 = __importDefault(require("net"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const CONFIG_PATH = path_1.default.join(__dirname, 'statusConfig.json');
let statusConfig = { channelId: '', messageId: '' };
if (fs_1.default.existsSync(CONFIG_PATH)) {
    try {
        statusConfig = JSON.parse(fs_1.default.readFileSync(CONFIG_PATH, 'utf-8'));
    }
    catch (e) {
        console.error('[STATUS] Error leyendo statusConfig.json');
    }
}
const SERVERS_CONFIG = [
    {
        name: '[ESP/EU] EL DESEO ARK X10 THE ISLAND',
        map: 'The Island',
        host: '192.168.2.11',
        port: 32330,
        password: 'Xelcore1234',
        publicHost: '79.112.113.207',
        publicPort: 27015,
    },
    {
        name: '[ESP/EU] EL DESEO ARK X10 RAGNAROK',
        map: 'Ragnarok',
        host: '192.168.2.11',
        port: 32331,
        password: 'Xelcore1234',
        publicHost: '79.112.113.207',
        publicPort: 27016,
    },
];
// 1. Verificación TCP ultra rápida (1 segundo)
function isPortOpen(host, port, timeoutMs = 1000) {
    return new Promise((resolve) => {
        const socket = new net_1.default.Socket();
        let resolved = false;
        socket.setTimeout(timeoutMs);
        socket.connect(port, host, () => {
            if (!resolved) {
                resolved = true;
                socket.destroy();
                resolve(true);
            }
        });
        socket.on('error', () => {
            if (!resolved) {
                resolved = true;
                socket.destroy();
                resolve(false);
            }
        });
        socket.on('timeout', () => {
            if (!resolved) {
                resolved = true;
                socket.destroy();
                resolve(false);
            }
        });
    });
}
// 2. Consulta RCON protegida con corte estricto a los 2 segundos
async function fetchPlayerCount(server) {
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(0), 2000));
    const rconTask = (async () => {
        let rcon = null;
        try {
            rcon = await rcon_client_1.Rcon.connect({
                host: server.host,
                port: server.port,
                password: server.password,
                timeout: 1500,
            });
            const response = await rcon.send('ListPlayers');
            const rawList = response.trim();
            if (rawList && !rawList.includes('No Players Connected')) {
                return rawList.split('\n').map((p) => p.trim()).filter(Boolean).length;
            }
            return 0;
        }
        catch {
            return 0;
        }
        finally {
            if (rcon) {
                try {
                    await rcon.end();
                }
                catch { }
            }
        }
    })();
    return Promise.race([rconTask, timeoutPromise]);
}
async function updateStatusMessage(client) {
    if (!statusConfig.channelId || !statusConfig.messageId) {
        return;
    }
    try {
        const channel = (await client.channels.fetch(statusConfig.channelId));
        if (!channel)
            return;
        const message = await channel.messages.fetch(statusConfig.messageId);
        if (!message)
            return;
        console.log('[STATUS] Iniciando comprobación de servidores...');
        const embed = new discord_js_1.EmbedBuilder()
            .setColor('#00ffcc')
            .setTitle('📊 ESTADO DE LOS SERVIDORES DE ARK')
            .setDescription('Información en tiempo real de la red de servidores.')
            .setTimestamp();
        for (const server of SERVERS_CONFIG) {
            const online = await isPortOpen(server.host, server.port);
            if (online) {
                // Si el puerto está abierto, intenta pedir jugadores con máximo 2s de espera
                const playersCount = await fetchPlayerCount(server);
                embed.addFields({
                    name: `🟢 ${server.name}`,
                    value: `> 🗺️ **Mapa:** \`${server.map}\`\n> 👥 **Jugadores:** \`${playersCount}\`\n> 🔗 \`steam://connect/${server.publicHost}:${server.publicPort}\``,
                    inline: false,
                });
            }
            else {
                embed.addFields({
                    name: `🔴 ${server.name} (OFFLINE)`,
                    value: `> 🌐 **IP:** \`${server.publicHost}:${server.publicPort}\`\n> ⚠️ *El servidor no responde o está en mantenimiento.*`,
                    inline: false,
                });
            }
        }
        await message.edit({ embeds: [embed] });
        console.log('[STATUS] Panel de Discord actualizado correctamente.');
    }
    catch (error) {
        console.error('[STATUS] Error actualizando el panel:', error);
    }
}
function setStatusMessageConfig(channelId, messageId, client) {
    statusConfig = { channelId, messageId };
    fs_1.default.writeFileSync(CONFIG_PATH, JSON.stringify(statusConfig, null, 2));
    updateStatusMessage(client);
}
function startStatusUpdater(client) {
    updateStatusMessage(client);
    setInterval(() => {
        updateStatusMessage(client);
    }, 60000);
}
