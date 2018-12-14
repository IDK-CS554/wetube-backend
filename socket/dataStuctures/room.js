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

class Room {
  constructor(roomId, creator, users = []) {
    this.roomId = roomId;
    this.creator = creator;
    this.users = users;
  }

  addUser(user) {
    this.users.push(user);
  }

  removeUser(userId, socket) {
    const removeIndex = this.users.map(u => u.userId).indexOf(userId);
    console.log("removeIndex", removeIndex);
    if (removeIndex !== -1) {
      const user = this.users[removeIndex];
      const username = user.username;
      const userId = user.userId;
      this.users.splice(removeIndex, 1);
      const roomId = this.roomId;
	    socket.to(`room${roomId}`).emit("userLeft", {username, roomId, userId});
    };
  }

  findUser(socketId) {
    const userFound = this.users.find(user => {
      return user.socketId === socketId;
    });

    return userFound === undefined ? false : userFound;
  }
}

module.exports = Room;
