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
