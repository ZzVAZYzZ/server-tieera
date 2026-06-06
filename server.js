const app = require('./src/app/app')
const port = 8000;
const http = require("http");
const { initSocket } = require("./src/socket/index");

const server = http.createServer(app);

// Gắn Socket.IO vào server
const io = initSocket(server);
app.set("io", io);

server.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })