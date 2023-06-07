import net from 'net';

const PORT = 12000;
const HOST = '127.0.0.1';

const client = net.connect({ port: PORT, host: HOST }, () => {
  console.log('server connected');
  client.write('hello world');
});

client.on('data', (data) => {
  console.log(`client got: ${data} from server`);
});

client.on('end', () => {
  console.log('server disconnected');
});
