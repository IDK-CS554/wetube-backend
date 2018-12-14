class User {
  constructor(id, username, socketId) {
    this.userId = id;
    this.username = username;
    this.socketId = socketId;
  }
}

module.exports = User;
