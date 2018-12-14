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
const rooms = socket => {
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
    console.log(`JOIN: ${username} wants to join room ${roomId}`);
    const roomFound = roomsData.find(room => {
    	return room.id === roomId;
    });

		if (roomFound) {
			const newUser = {
				id: uuid(),
				username
			};

			roomsData = roomsData.map(room => {
				if (room.id === roomId) {
					return {
						...room,
						users: [
							...room.users,
							newUser
						]
					}
				} else {
					return room;
				}
			});
			console.log('room joined', roomsData);
			socket.emit('joinRoomSuccessful', {roomId, username});
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
	  roomsData.push({
	    id: newId,
	    creator: username,
	    users: [newUser]
    });
    console.log('new rooms', roomsData);
    console.log(`CREATE: ${username} created a new room! ID: ${newId}`);
    socket.emit("createRoomSuccessful", newId);
  });
};

module.exports = {
  rooms
};
