import dgram from 'dgram';
import { Buffer } from 'buffer';

const message = Buffer.from('hello world');
const client = dgram.createSocket('udp4');
const PORT = 12000;
const HOST = '127.0.0.1';

client.send(message, 0, message.length, PORT, HOST, (err) => {
  console.log(`UDP message sent to ${HOST}:${PORT}`);
  client.close();
});
