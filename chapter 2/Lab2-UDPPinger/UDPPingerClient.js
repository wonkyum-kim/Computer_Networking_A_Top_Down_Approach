import dgram from 'dgram';

const serverHost = '127.0.0.1';
const serverPort = 12000;

const client = dgram.createSocket('udp4');

let num = 1;
let startTime;
let timerId;

function sendPing() {
  const time = new Date().getTime();
  const message = `Ping ${num} ${time}`;

  client.send(message, 0, message.length, serverPort, serverHost, (err) => {
    if (err) {
      throw err;
    }
    console.log(`Ping message sent: ${message}`);
    startTime = time;

    // 1초가 넘어가면 응답을 기다리지 않고 다음 메시지를 보낸다.
    timerId = setTimeout(handleTimeout, 1000);
    clearTimeout(timerId);
  });
}

function handleTimeout() {
  console.log('Request timed out');

  num++;
  if (num <= 10) {
    sendPing();
  } else {
    client.close();
  }
}

function handleMessage(message) {
  const RTT = (new Date().getTime() - startTime) / 1000;

  if (message !== 'Packet lost') {
    console.log(`Response from server: ${message}`);
    console.log(`Round trip time: ${RTT} seconds`);
  } else {
    console.log(message);
  }

  num++;
  if (num <= 10) {
    sendPing();
  } else {
    client.close();
  }
}

client.on('message', (message) => {
  handleMessage(message.toString());
});

sendPing();
