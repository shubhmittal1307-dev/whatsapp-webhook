const http = require('http');
const https = require('https');
const url = require('url');

const MAKE_WEBHOOK = 'https://hook.us2.make.com/djnowd57547qdz2mtlyb68l6vjby0w0f';

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  if (req.method === 'GET' && parsed.pathname === '/webhook') {
    const mode = parsed.query['hub.mode'];
    const token = parsed.query['hub.verify_token'];
    const challenge = parsed.query['hub.challenge'];
    if (mode === 'subscribe' && token === 'mshomesbot') {
      res.writeHead(200);
      res.end(challenge);
    } else {
      res.writeHead(403);
      res.end('Forbidden');
    }

  } else if (req.method === 'POST' && parsed.pathname === '/webhook') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      // Forward to Make.com
      const makeUrl = new url.URL(MAKE_WEBHOOK);
      const options = {
        hostname: makeUrl.hostname,
        path: makeUrl.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
      };
      const proxyReq = https.request(options);
      proxyReq.write(body);
      proxyReq.end();
      res.writeHead(200);
      res.end('OK');
    });

  } else {
    res.writeHead(200);
    res.end('Bot is running');
  }
});

server.listen(process.env.PORT || 3000);
