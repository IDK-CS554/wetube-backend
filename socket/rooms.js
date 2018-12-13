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

	/**
   * Rooms will be an array of objects with the following structure:
   * [
   *  {
   *    roomId: *will be the room id*
   *    creator: *id or username of the user who is the creator*
   *    users: [
   *      user,
   *      user
   *      *this array will be an array of users (defined below)*
   *    ]
   *  }
   * ]
   *
   * User will be an object with the following properties:
   * {
   *   id: *uuid or simple numeric id*
   *   username: *username/displayname*
   * }
	 */

	socket.on("joinRoom", async payload => {
    const { roomId, username } = payload;
    console.log(`JOIN: ${username} wants to join room ${roomId}`);
    // io.sockets.emit("results", { res, username, message });
  });

  socket.on("createRoom", async payload => {
    const { username } = payload;
    const newId = nextRoomId(rooms);
    rooms.push(newId);
    console.log(`CREATE: ${username} created a new room! ID: ${newId}`);
    socket.emit("createRoomSuccessful", newId);
  });
};

module.exports = {
  rooms
};
