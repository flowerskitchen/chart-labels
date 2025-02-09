const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;
const LOG_FILE = 'requests.log';
const COUNTER_FILE = 'counter.json';

function logRequest(method, path) {
  const logEntry = `[${new Date().toISOString()}] ${method} ${path}\n`;
  fs.appendFile(LOG_FILE, logEntry, (err) => {
    if (err) console.error('Error writing to log:', err);
  });
}






function getCounter() {
  try {
    const data = fs.readFileSync(COUNTER_FILE, 'utf8');
    return JSON.parse(data).count || 0;
  } catch {
    return 0;
  }
}

function updateCounter() {
  const count = getCounter() + 1;
  fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count }), 'utf8');
  return count;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  logRequest(req.method, parsedUrl.pathname);

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    if (parsedUrl.pathname === '/') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Welcome to the Node.js server!' }));
    } else if (parsedUrl.pathname === '/hello') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Hello, world!' }));
    } else if (parsedUrl.pathname === '/time') {
      res.writeHead(200);
      res.end(JSON.stringify({ time: new Date().toISOString() }));
    } else if (parsedUrl.pathname === '/counter') {
      res.writeHead(200);
      res.end(JSON.stringify({ count: updateCounter() }));
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  } else {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
