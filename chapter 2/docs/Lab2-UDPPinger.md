## 문제2. UDP Ping

### Description

이 문제에서 클라이언트는 UDP를 사용해 간단한 `ping` 메시지를 서버로 보내고, 서버는 그에 대응하는 `pong`메시지를 보내게 됩니다.

`UDP`는 비신뢰적인 프로토콜이기 때문에 패킷이 손실 될 수 있습니다.

따라서 클라이언트는 응답을 무한정 기다리지 않고, 1초가 지났다면 손실되었다고 가정하고 적절한 메시지를 출력하게 됩니다.

### Server

이 서버 코드에서는 클라이언트 패킷의 30%가 손실되는 것으로 시뮬레이션됩니다.

패킷이 들어오고 임의의 정수가 4보다 크거나 같으면 서버는 단순히 캡슐화된 데이터를 대문자로 변환하여 클라이언트로 다시 보냅니다.

```js
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
```

### Client

클라이언트는 서버에 10개의 ping을 보냅니다.

UDP는 신뢰할 수 없는 프로토콜이기 때문에 클라이언트에서 서버로 보낸 패킷이 네트워크에서 손실 될 수 있으며 그 반대의 경우도 마찬가지입니다.

이러한 이유로 클라이언트는 ping 메시지에 대한 응답을 무한정 기다릴 수 없습니다.

클라이언트가 응답을 위해 최대 1초 동안 기다려야 합니다.

1초 이내에 응답이 수신되지 않으면 클라이언트 프로그램은 네트워크를 통한 전송 중에 패킷이 손실된 것으로 가정합니다.

클라이언트 프로그램은 다음과 같이 진행됩니다.

(1) UDP를 사용하여 ping 메시지를 보냅니다.  
(2) 서버의 응답 메시지가 있는 경우 인쇄합니다.  
(3) 서버가 응답하는 경우 각 패킷의 왕복 시간(RTT)을 초 단위로 계산하고 인쇄합니다.  
(4) 그렇지 않으면 "Request timed out"을 출력합니다.

```js
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

    timerId = setTimeout(handleTimeout, 1000);
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
  clearTimeout(timerId);
  handleMessage(message.toString());
});

sendPing();
```
