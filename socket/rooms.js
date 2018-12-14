const uuid = require("uuid/v4");
const { RoomBuffer, Room, User } = require("./dataStuctures");
let roomsData = new RoomBuffer();

/**
 * Takes in a socket Object and modifies it to
 * listen for events that are related to rooms
 *
 * @param {Socket.io Socket Object} socket
 */
const rooms = (socket, io) => {
  // TODO: temporary array to store rooms, should move this to redis or something
  socket.on("joinRoom", async payload => {
    const { roomId, username } = payload;
    const roomFound = roomsData.findRoom(roomId);

    if (roomFound) {
      const newUser = new User(uuid(), username);
      roomFound.addUser(newUser);
      io.emit("joinRoomSuccessful", roomFound);
    } else {
      socket.emit("joinRoomUnsuccessful", roomId);
    }
  });

  socket.on("createRoom", async payload => {
    const { username } = payload;
    const newUser = new User(uuid(), username);
    const newRoom = roomsData.addRoom(username, [newUser]);
    socket.emit("createRoomSuccessful", newRoom);
  });

  socket.on("joinVideoChat", payload => {
    console.log("join video chat", payload);
  });
};

module.exports = {
  rooms,
  roomsData
};
