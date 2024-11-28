const express = require("express");
const server = express();
const cors = require("cors");
const connect = require("./database/database");
const dotenv = require("dotenv");
const port = process.env.PORT || 8081;

//middlewares
dotenv.config();
server.use(cors());
server.use(express.json());

// Default route
server.get("/api/", (req, res) => {
  res.send("You are trapped already? Shame on you!");
});

// server routes
server.use("/api", require("./api/auth"));
server.use("/api", require("./api/farm"));

//database connection
connect();

// starting the sever
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
