const fs = require("fs");
const users = JSON.parse(fs.readFileSync("data.json", "utf-8")).users;

const createUser = (req, res) => {
  // console.log(req.body);
  users.push(req.body);
  res
    .status(201)
    .json({ message: "User successfully created", user: req.body });
};

const getUsers = (req, res) => {
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
};

const getUserById = (req, res) => {
  const id = +req.params.id;
  const user = users.find((p) => p.id === id);
  if (user) {
    res.json({ message: "User found", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUser = (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1, { ...req.body, id: id });
    res.status(200).json({ message: "User updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const updateUserPartial = (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    users.splice(userIndex, 1, { ...user, ...req.body });
    res.status(200).json({ message: "User updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const deleteUser = (req, res) => {
  const id = +req.params.id;
  const userIndex = users.findIndex((p) => p.id === id);
  if (userIndex !== -1) {
    const user = users[userIndex];
    users.splice(userIndex, 1);
    res.status(200).json({ message: "User deleted successfully", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
};
