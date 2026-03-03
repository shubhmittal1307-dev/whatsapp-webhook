const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);
  
  if (req.method === 'GET' && parsed.pathname === '/webhook') {
    const mode = parsed.query['hub.mode'];
    const token = parsed.query['hub.verify_token'];
    const challenge = parsed.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === 'mshomesbot') {
      console.log('Webhook verified!');
      res.writeHead(200);
      res.end(challenge);
    } else {
      res.writeHead(403);
      res.end('Forbidden');
    }
  } else if (req.method === 'POST' && parsed.pathname === '/webhook') {
    res.writeHead(200);
    res.end('OK');
  } else {
    res.writeHead(200);
    res.end('Bot is running');
  }
});

server.listen(process.env.PORT || 3000);
