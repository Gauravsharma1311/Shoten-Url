const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const usersRouter = require("./routes/usersRouter");

const server = express();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

server.use(cors());
server.use(express.json());
server.use(morgan("dev"));
server.use(express.static("public"));

server.use("/users", usersRouter);

const PORT = process.env.PORT || 2100;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
