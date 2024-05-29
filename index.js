const fs = require("fs");
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));
const users = data.users;

const express = require("express");
const morgan = require("morgan");
const server = express();

server.use(express.json());
server.use(morgan("default"));
server.use(express.static("public"));

// C R U D OPERATIONS
// Create push API
server.post("/users", (req, res) => {
  console.log(req.body);
  users.push(req.body);
  res.status(201).json(req.body);
});

// Read get API with pagination
server.get("/users", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedUsers = users.slice(startIndex, endIndex);
  res.json({
    pagination: {
      page,
      limit,
      totalUsers: users.length,
      totalPages: Math.ceil(users.length / limit),
    },
    users: paginatedUsers,
  });
});

// Read get API by id
server.get("/users/:id", (req, res) => {
  const id = +req.params.id;
  const user = users.find((p) => p.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update put API
server.put("/users/:id", (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1, { ...req.body, id: id });
    res.status(200).json({ message: "User updated" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update patch API
server.patch("/users/:id", (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    users.splice(userIndex, 1, { ...user, ...req.body });
    res.status(200).json({ message: "User updated" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete API
server.delete("/users/:id", (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    users.splice(userIndex, 1);
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

server.listen(2100, () => {
  console.log("Server Started on port 2100");
});
