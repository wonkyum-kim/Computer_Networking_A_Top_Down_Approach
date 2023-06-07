import dgram from 'dgram';

const server = dgram.createSocket('udp4');
const PORT = 12000;
const HOST = '127.0.0.1';

server.on('error', (err) => {
  console.log(`server error: ${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from client`);
  const upper = msg.toString().toUpperCase();
  server.send(upper, rinfo.port, rinfo.address, (err) => {
    if (err) {
      console.error('Error', err);
    }
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(PORT, HOST);
