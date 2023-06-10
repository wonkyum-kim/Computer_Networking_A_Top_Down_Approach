import http from 'http';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const exists = promisify(fs.exists);
const __dirname = path.resolve();

const cacheDirectory = path.join(__dirname, 'cache'); // 캐시 디렉토리 경로
const cacheExpiration = 60 * 60 * 1000; // 캐시 만료 시간 (1시간)

// 캐시 디렉토리가 없으면 생성
if (!fs.existsSync(cacheDirectory)) {
  fs.mkdirSync(cacheDirectory);
}

const proxyServer = http.createServer(async (clientReq, clientRes) => {
  const cacheFile = path.join(
    cacheDirectory,
    encodeURIComponent(clientReq.url)
  );

  // 캐시 파일이 존재하고 만료 기간 내에 있는지 확인
  if (await exists(cacheFile)) {
    const stat = await fs.promises.stat(cacheFile);
    const currentTime = new Date().getTime();

    if (currentTime - stat.mtime.getTime() < cacheExpiration) {
      console.log('Cache hit:', clientReq.url);
      const cacheData = await readFile(cacheFile);
      clientRes.end(cacheData);
      return;
    }
  }

  console.log('Cache miss!');

  const options = {
    host: clientReq.headers.host,
    path: clientReq.url,
    method: clientReq.method,
    headers: clientReq.headers,
  };

  // 클라이언트 요청을 웹 서버로 전달
  const proxyReq = http.request(options, async (proxyRes) => {
    const cacheStream = fs.createWriteStream(cacheFile);
    proxyRes.pipe(cacheStream); // 응답 데이터를 캐시 파일에 저장
    proxyRes.pipe(clientRes); // 웹 서버 응답을 클라이언트에게 전달
  });

  proxyReq.on('error', (error) => {
    console.error('Proxy request error:', error);
    clientRes.end();
  });

  proxyReq.end();
});

const PORT = 8888;
proxyServer.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
