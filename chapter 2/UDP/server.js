import dgram from 'dgram';

const server = dgram.createSocket('udp4');
const PORT = 12000;
const HOST = '127.0.0.1';

server.on('error', (err) => {
  console.log(`server error: ${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  const upper = msg.toString().toUpperCase();
  console.log(`server got: ${upper} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT, HOST);
