const express = require("express");
const app = express();
var http = require("http").Server(app);
const PORT = process.env.PORT || 5000;
const io = require("socket.io")(http);

const { routes } = require("./routes");
const { sockets } = require("./socket");

// listen for REST calls
// routes(app);
// listen for socket events
sockets(io);

http.listen(PORT, () => {
  console.log(`Backend is listening on ${PORT}`);
});
