import { Rcon } from 'rcon-client';

async function testRcon() {
  const servers = [
    { name: 'THE ISLAND', host: '192.168.2.11', port: 32330, password: 'Xelcore1234' },
    { name: 'RAGNAROK', host: '192.168.2.11', port: 32331, password: 'Xelcore1234' },
  ];

  for (const s of servers) {
    console.log(`\n----------------------------------------`);
    console.log(`Intentando conectar a ${s.name} (${s.host}:${s.port})...`);
    try {
      const rcon = await Rcon.connect({
        host: s.host,
        port: s.port,
        password: s.password,
        timeout: 5000,
      });
      console.log(`[ÉXITO] ¡Conectado correctamente a ${s.name}!`);

      const response = await rcon.send('ListPlayers');
      console.log(`[RESPUESTA RCON] ListPlayers ->`, JSON.stringify(response));

      await rcon.end();
      console.log(`[OK] Conexión cerrada limpiamente para ${s.name}`);
    } catch (err: any) {
      console.error(`[FALLO DE CONEXIÓN] ${s.name}:`, err.message || err);
    }
  }
}

testRcon();