import net from 'net';

const PORT = 12000;
const HOST = '127.0.0.1';

const server = net.createServer((socket) => {
  console.log('client connected.');

  socket.on('data', (data) => {
    console.log(`server got: ${data} from client`);

    const upper = data.toString().toUpperCase();
    socket.write(upper);
  });

  socket.on('end', () => {
    console.log('client disconnected');
  });
});

server.listen(PORT, HOST, () => {
  console.log(`server listening ${HOST}:${PORT}`);
});
