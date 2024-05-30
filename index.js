const express = require("express");
const morgan = require("morgan");
const server = express();
const usersRouter = require("./routes/usersRouter");

server.use(express.json());
server.use(morgan("default"));
server.use(express.static("public"));

server.use("/users", usersRouter);

server.listen(2100, () => {
  console.log("Server started on port 3000");
});
