require("dotenv").config();
const express = require("express");
const app = express();
var http = require("http").Server(app);
const PORT = process.env.PORT || 5000;
const io = require("socket.io")(http);
const cors = require("cors");

const { routes } = require("./routes");
const { sockets } = require("./socket");
const {roomsData} = require("./socket/rooms");

// allow cross-origin
app.use(cors());

app.get('/getUsers/:roomId', (req, res) => {
  const roomId = parseInt(req.params.roomId);

  if (isNaN(roomId)) {
    res.status(400).send({error: 'Room Id is not a number.'});
    return;
  }

  const room = roomsData.find(room => {
    return room.id === roomId;
  });

  if (!room) {
    res.status(404).send({error: 'Room not found.'})
  } else {
    res.send(room.users);
  }
});

// listen for REST calls
routes(app);
// listen for socket events
sockets(io.of("/final"));

http.listen(PORT, () => {
  console.log(`Backend is listening on port ${PORT}`);
});
