const { rooms } = require("./rooms");

/**
 * Takes the socket.io Object and modifies it to listen to various events
 * related to rooms, etc.
 * @param {socket.io Object} io
 */
const sockets = io => {
  io.on("connection", socket => {
    console.log("a client connected to socket", socket.id);
    // add room-related events to socket
    rooms(socket, io);
  });
};

module.exports = {
  sockets
};
