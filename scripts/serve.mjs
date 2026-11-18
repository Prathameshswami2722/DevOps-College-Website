import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';

const root = process.argv.includes('--dist') ? 'dist' : '.';
const port = Number(process.env.PORT ?? 8080);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png'
};

createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const requestedPath = url.pathname === '/' ? '/index.html' : url.pathname;
  const safePath = normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  const filePath = join(root, safePath);

  try {
    const file = await stat(filePath);
    if (!file.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(JSON.stringify({ error: 'Not found' }));
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Asteria website available at http://127.0.0.1:${port}`);
});
