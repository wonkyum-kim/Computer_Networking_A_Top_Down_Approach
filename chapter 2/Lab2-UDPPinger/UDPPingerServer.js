import dgram from 'dgram';

const server = dgram.createSocket('udp4');

server.bind(12000);

server.on('message', (message, remote) => {
  const rand = Math.floor(Math.random() * 11);

  let response = message.toString().toUpperCase();

  if (rand < 4) {
    response = 'Packet lost';
  }

  server.send(response, remote.port, remote.address, (err) => {
    if (err) {
      throw err;
    }
    console.log('Response sent:', response);
  });
});

server.on('listening', () => {
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server socket closed');
    process.exit();
  });
});
