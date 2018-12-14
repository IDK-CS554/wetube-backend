const Room = require("./room");

class RoomBuffer {
  // This is a data structure that holds Rooms
  constructor() {
    this.rooms = [];
  }

  /**
   * Adds Room to Buffer. Returns new Room
   * @param {Room} room
   */
  addRoom(creator, users = []) {
    const roomId = this.rooms.length + 1;
    const newRoom = new Room(roomId, creator, users);
    this.rooms.push(newRoom);
    return newRoom;
  }

  findUser(socketId) {
    const roomWithUser = this.rooms.find(room => {
      return room.findUser(socketId);
    });

    return roomWithUser === undefined ? null : roomWithUser.findUser(socketId);
  };

	removeUser(user, socket) {
	  this.rooms.forEach(room => {
	    if (user) {
		    room.removeUser(user.userId, socket);
      }
    })
  }

  /**
   * Finds and returns a room by its roomId
   * @param {uuid} roomId
   */
  findRoom(roomId) {
    return this.rooms.find(r => r.roomId === roomId);
  }

  /**
   * Removes a room by its roomId
   * @param {uuid} roomId
   */
  removeRoom(roomId) {
    const removeId = this.rooms.map(r => r.roomId).indexOf(roomId);
    this.rooms.splice(removeId, 1);
  }

  /**
   * Pass in the roomIds list to get the next roomId to
   * use when a user wants to create a new room. This method
   * recycles numbers, so it returns the lowest postive number
   * not currently in use
   *
   * @param {Array} roomIds
   */
  nextRoomId() {
    let { rooms } = this;
    if (rooms === []) return 1;
    else {
      // tempArr is to avoid mutating the roomIds arr
      let tempArr = Object.assign([], rooms);
      // set all numbers < tempArr to negative.
      for (let i = 0; i < tempArr.length; i++) {
        // if abs val of curr val is lt tempArr.length,
        // set the val at that index to negative
        if (Math.abs(tempArr[i]) <= tempArr.length)
          tempArr[Math.abs(tempArr[i]) - 1] *= -1;
      }
      // iterate the tempArr, and if we encounter a
      // number that is not negative, then this is new
      // roomId, or if we get the end, then we return the tempArr.length
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] > 0) return i + 1;
      }
      return tempArr.length + 1;
    }
  }
}

module.exports = RoomBuffer;
