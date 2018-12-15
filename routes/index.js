// graphql api data
const data = require("./data");

const routes = app => {
  app.use("/data", data);
};

module.exports = {
  routes
};
