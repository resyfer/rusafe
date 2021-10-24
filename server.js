const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const path = require("cors");
const { ApolloServer } = require("apollo-server-express");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("dotenv").config({ path: "./config/.env" });

(async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();
  server.applyMiddleware({ app });
  console.log("GraphQL Server Started");

  await mongoose.connect(process.env.MONGO_URI);
  console.log("DB Connected");

  process.env.NODE_ENV == "production" &&
    app.get("*", (req, res) => {
      res.status(200).sendFile(path.resolve("client", "dist", "index.html"));
    });

  app.listen(process.env.PORT, () => {
    console.log(
      `Server connected to ${process.env.PORT} in mode ${process.env.NODE_ENV}`
    );
  });
})();
