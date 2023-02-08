import http from "http";
import { Server } from 'socket.io';
import fs from "fs";
import path from "path";

const host = "localhost";
const port = 3000;


const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    const filePath = path.join(process.cwd(), "./index.html");
    const rs = fs.createReadStream(filePath);

    rs.pipe(res);
  }
});

const io = new Server(server);

io.on('connection', (client) => {

  client.on('setUserName', (name) => {
    client.name = name;
    client.broadcast.emit('NEW_CONN_EVENT', { msg: `${name} connected` });
    client.emit('userSet', { username: name });
    console.log(`Websocket connected ${name}`);
  });

  client.on('disconnect', (reason) => {
    client.broadcast.emit('DISCONN_EVENT', { msg: `${client.name} disconnected` });
    console.log(`${client.name} disconnected => ${reason}`);
  });

  client.on('client-msg', (data) => {
    client.broadcast.emit('server-msg', { msg: data.msg, user: data.user })
    client.emit('server-msg', { msg: data.msg, user: data.user })
  })
})

server.listen(port, host, () =>
  console.log(`Server running at http://${host}:${port}`)
);
