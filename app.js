require("dotenv").config();
const express = require("express");
const app = express();
var http = require("http").Server(app);
const PORT = process.env.PORT || 5000;
const io = require("socket.io")(http);
const cors = require("cors");

const { routes } = require("./routes");
const { sockets } = require("./socket");

// allow cross-origin
app.use(cors());

// listen for REST calls
routes(app);
// listen for socket events
sockets(io.of("/final"));

http.listen(PORT, () => {
  console.log(`Backend is listening on port ${PORT}`);
});
