const { nextRoomId } = require("./utils");

/**
 * Takes in a socket Object and modifies it to
 * listen for events that are related to rooms
 *
 * @param {Socket.io Socket Object} socket
 */
const rooms = socket => {
  // TODO: temporary array to store rooms, should move this to redis or something
  let rooms = [];
  socket.on("joinRoom", async payload => {
    const { roomId, username } = payload;
    console.log(`JOIN: ${username} wants to join room ${roomId}`);
    // io.sockets.emit("results", { res, username, message });
  });

  socket.on("createRoom", async payload => {
    const { username } = payload;
    const newId = nextRoomId(rooms);
    rooms.push(newId);
    console.log(
      `CREATE: ${username} wants to create a new room!\nCreated room ${newId}`
    );
  });
};

module.exports = {
  rooms
};
