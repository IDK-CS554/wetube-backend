const uuid = require("uuid/v4");
const { promisify } = require("util");
const redis = require("redis"),
  client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const { RoomBuffer, User } = require("./dataStuctures");

client.set("rooms", JSON.stringify(new RoomBuffer().toObject()));

const getRooms = async () => {
  let rooms = await getAsync("rooms");
  rooms = JSON.parse(rooms);
  return new RoomBuffer(rooms.rooms);
};

const setRooms = async roomBuffer => {
  await client.set("rooms", JSON.stringify(roomBuffer.toObject()));
};

/**
 * Takes in a socket Object and modifies it to
 * listen for events that are related to rooms
 *
 * @param {Socket.io Socket Object} socket
 */
const rooms = async (socket, io) => {
  socket.on("joinRoom", async payload => {
    const roomsData = await getRooms();
    console.log("rooms", roomsData);
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
    await setRooms(roomsData);
  });

  socket.on("createRoom", async payload => {
    const roomsData = await getRooms();
    console.log("rooms", roomsData);
    const { username } = payload;
    const newUser = new User(uuid(), username, socket.id);
    const newRoom = roomsData.addRoom(username, [newUser]);
    socket.join(`room${newRoom.roomId}`);
    socket.emit("createRoomSuccessful", { newRoom, username });
    console.log(roomsData);
    await setRooms(roomsData);
  });

  socket.on("joinVideoChat", payload => {
    console.log("join video chat", payload);
  });

  socket.on("sendText", payload => {
    const { text, roomId, username } = payload;
    socket.to(`room${roomId}`).emit("receivedText", { username, text, roomId });
  });

  socket.on("changeRoomType", payload => {
    const { roomId, videoId } = payload;
    io.in(`room${roomId}`).emit("changeRoomType", { roomId, videoId });
  });

  socket.on("playVideo", ({ roomId }) => {
    io.in(`room${roomId}`).emit("playVideo");
  });

  socket.on("pauseVideo", roomId => {
    io.in(`room${roomId}`).emit("pauseVideo");
  });

  socket.on("seekVideo", ({ roomId, currTime }) => {
    socket.to(`room${roomId}`).emit("seekVideo", currTime);
  });

  socket.on("exitRoom", async () => {
    const roomsData = await getRooms();
    console.log("rooms", roomsData);
    const user = roomsData.findUser(socket.id);
    roomsData.removeUser(user, socket);
    await setRooms(roomsData);
  });

  socket.on("disconnect", async () => {
    const roomsData = await getRooms();
    console.log("rooms", roomsData);
    const user = roomsData.findUser(socket.id);
    console.log("user disconnected", socket.id);
    roomsData.removeUser(user, socket);
    await setRooms(roomsData);
  });
};

module.exports = {
  rooms,
  getRooms
};
