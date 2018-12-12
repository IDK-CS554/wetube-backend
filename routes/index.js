// const rooms = require("./rooms");
// const users = require("./users");
// const videos = require("./videos");

const routes = app => {
  app.use("/rooms", rooms);
  // app.use("/users", users);
  // app.use("/videos", videos);
};

module.exports = {
  routes
};
