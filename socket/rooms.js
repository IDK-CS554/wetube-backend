const uuid = require("uuid/v4");
const { RoomBuffer, Room, User } = require("./dataStuctures");
let roomsData = new RoomBuffer();
// TODO: temporary array to store rooms, should move this to redis or something

/**
 * Takes in a socket Object and modifies it to
 * listen for events that are related to rooms
 *
 * @param {Socket.io Socket Object} socket
 */
const rooms = (socket, io) => {
  socket.on("joinRoom", async payload => {
    const { roomId, username } = payload;
    const roomFound = roomsData.findRoom(roomId);

    if (roomFound) {
      const newUser = new User(uuid(), username, socket.id);
      roomFound.addUser(newUser);
      socket.join(`room${roomId}`);
      io.to(`room${roomId}`).emit("joinRoomSuccessful", roomFound);
    } else {
      socket.emit("joinRoomUnsuccessful", roomId);
    }
  });

  socket.on("createRoom", async payload => {
    const { username } = payload;
    const newUser = new User(uuid(), username, socket.id);
    const newRoom = roomsData.addRoom(username, [newUser]);
    socket.join(`room${newRoom.roomId}`);
    socket.emit("createRoomSuccessful", {newRoom, username});
  });

  socket.on("joinVideoChat", payload => {
    console.log("join video chat", payload);
  });

  socket.on("sendText", payload => {
    const { text, roomId, username } = payload;
    socket.to(`room${roomId}`).emit("receivedText", { username, text, roomId });
  });

  socket.on("exitRoom", () => {
	  const user = roomsData.findUser(socket.id);
	  roomsData.removeUser(user, socket);
  });

	socket.on("disconnect", function() {
		const user = roomsData.findUser(socket.id);
		console.log('user disconnected', socket.id);
		roomsData.removeUser(user, socket);
	});
};

module.exports = {
  rooms,
  roomsData
};
