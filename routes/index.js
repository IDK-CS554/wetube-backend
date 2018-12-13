// const rooms = require("./rooms");
// const users = require("./users");
// const videos = require("./videos");

// api data
const data = require("./data");

const routes = app => {
  // app.use("/rooms", rooms);
  // app.use("/users", users);
  // app.use("/videos", videos);
  // get api data from graphgql
  app.use("/graphql", data);
};

module.exports = {
  routes
};
