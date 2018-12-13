const express = require("express");
const router = express.Router();
const graphqlHTTP = require("express-graphql");
const schema = require("./schema");

router.use(
  "/",
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

module.exports = router;
