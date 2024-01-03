## 문제1. Web Server

이 문제에서는 웹 서버를 만들고 요청한 파일을 전송합니다.

요청한 파일이 있으면 헤더 라인과 요청된 파일로 구성된 HTTP 응답 메시지를 보내고, 없으면 "404 Not Found" 메시지를 클라이언트에 보내야 합니다.

클라이언트가 요청할 파일은 아래와 같은 간단한 HTML 파일 입니다.

서버가 있는 동일한 디렉토리에 `HelloWorld.html`을 넣습니다.

```html:HelloWorld.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

서버는 `6789`번 포트로 설정되어 있고, 요청이 들어오면 파일을 찾아 전송합니다.

```js:server.js
import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
  console.log('Ready to serve...');

  try {
    const filename = req.url.substring(1);
    console.log(filename);
    const fileContent = fs.readFileSync(filename, 'utf-8');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(fileContent);
    res.end();
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.write('<h1>404 Not Found</h1>');
    res.end();
  }
});

const port = 6789;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

서버를 실행 중인 호스트의 IP 주소를 확인합니다.

저는 제 컴퓨터에서 실행할 것이기 때문에 제 ip 주소를 알아야 합니다.

자신의 ip 주소를 얻는 방법은 `ipconfig` 명령어를 사용하면 됩니다.

그리고 서버를 실행합니다.

```shell
node server.js
```

서버가 실행되었다면, 클라이언트는 해당 URL에 접속하면 원하는 파일을 얻을 수 있습니다.

```
http://서버의ip주소:6789/HelloWorld.html
```

서버에 없는 파일을 요청하면 "404 Not Found" 메시지가 표시됩니다.
