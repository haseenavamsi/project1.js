const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  if (url === '/') {
    const filePath = path.join(__dirname, 'message.txt');
    fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
      if (err) {
        console.log(err);
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.write('404 Not Found');
        res.end();
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head>');
        res.write(`<title>${data}</title>`);
        res.write('</head>');
        res.write('<body>');
        res.write(`<h1>${data}</h1>`);
        res.write('<form action="/message" method="POST">');
        res.write('<input type="text" name="message">');
        res.write('<button type="submit">Send</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        res.end();
      }
    });
  } else if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, (err) => {
        if (err) {
          console.log(err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'text/plain');
          res.write('500 Internal Server Error');
          res.end();
        } else {
          res.statusCode = 302;
          res.setHeader('Location', '/');
          res.end();
        }
      });
    });
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.write('404 Not Found');
    res.end();
  }
});

server.listen(3000);
console.log('Server is running on port 3000');
