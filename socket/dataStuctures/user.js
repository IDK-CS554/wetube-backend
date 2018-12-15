class User {
  constructor(id, username, socketId) {
    this.userId = id;
    this.username = username;
    this.socketId = socketId;
  }

  toObject() {
    return {
      userId: this.userId,
      username: this.username,
      socketId: this.socketId
    };
  }
}

module.exports = User;
