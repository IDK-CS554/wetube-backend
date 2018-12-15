const User = require("./user");

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
  constructor(roomId, creator, users = [], time = 0, videoId = "") {
    this.roomId = roomId;
    this.creator = creator;
    this.videoId = videoId;
    this.time = time;
    if (users instanceof User) {
      this.users = users;
    } else {
      this.users = users.map(u => new User(u.userId, u.username, u.socketId));
    }
  }

  addUser(user) {
    this.users.push(user);
  }

  removeUser(userId, socket) {
    const removeIndex = this.users.map(u => u.userId).indexOf(userId);
    const roomId = this.roomId;
    console.log("removeIndex", removeIndex);
    if (removeIndex !== -1) {
      if (this.users.length === 1) {
        socket.to(`room${roomId}`).emit("roomEmpty", { roomId });
      }
      const user = this.users[removeIndex];
      const username = user.username;
      const userId = user.userId;
      this.users.splice(removeIndex, 1);
      socket.to(`room${roomId}`).emit("userLeft", { username, roomId, userId });
    }
  }

  findUser(socketId) {
    const userFound = this.users.find(user => {
      return user.socketId === socketId;
    });

    return userFound === undefined ? false : userFound;
  }

  toObject() {
    return {
      roomId: this.roomId,
      creator: this.creator,
      users: this.users.map(u => u.toObject()),
      videoId: this.videoId,
      time: this.time
    };
  }
}

module.exports = Room;
