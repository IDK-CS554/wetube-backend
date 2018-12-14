const uuid = require('uuid/v4');
// const { nextRoomId } = require("./utils");

let roomsData = [];
let nextRoomId = 1;

/**
 * Takes in a socket Object and modifies it to
 * listen for events that are related to rooms
 *
 * @param {Socket.io Socket Object} socket
 */
const rooms = (socket, io) => {
  // TODO: temporary array to store rooms, should move this to redis or something

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
    const roomFound = roomsData.find(room => {
    	return room.id === roomId;
    });

		if (roomFound) {
			const newUser = {
				id: uuid(),
				username
			};

			for (let i = 0; i < roomsData.length; i++) {
				if (roomsData[i].id === roomId) {
					roomsData[i].users.push(newUser);
				}
			}
			io.emit('joinRoomSuccessful', roomFound);
		} else {
			socket.emit('joinRoomUnsuccessful', roomId)
		}
    // io.sockets.emit("results", { res, username, message });
  });

  socket.on("createRoom", async payload => {
    const { username } = payload;
    const newId = nextRoomId++;
    const newUser = {
    	id: uuid(),
	    username
    };
    const newRoomData = {
	    id: newId,
	    creator: username,
	    users: [newUser]
    };
	  roomsData.push(newRoomData);
    socket.emit("createRoomSuccessful", newRoomData);
  });
};

module.exports = {
  rooms,
	roomsData
};
