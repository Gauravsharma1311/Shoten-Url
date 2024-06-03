const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = JSON.parse(fs.readFileSync("data.json", "utf-8")).users;
const SECRET_KEY = "Gaurav"; // Ideally, store this in an environment variable

const createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    maidenName,
    age,
    gender,
    email,
    phone,
    username,
    password,
    birthDate,
    image,
    bloodGroup,
    height,
    weight,
    eyeColor,
    hair,
    domain,
    ip,
    address,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    firstName,
    lastName,
    maidenName,
    age,
    gender,
    email,
    phone,
    username,
    password: hashedPassword,
    birthDate,
    image,
    bloodGroup,
    height,
    weight,
    eyeColor,
    hair,
    domain,
    ip,
    address,
  };

  users.push(newUser);
  fs.writeFileSync("data.json", JSON.stringify({ users }), "utf-8");
  res.status(201).json({ message: "User successfully created", user: newUser });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ message: "Login successful", token });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
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
    fs.writeFileSync("data.json", JSON.stringify({ users }), "utf-8");
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
    fs.writeFileSync("data.json", JSON.stringify({ users }), "utf-8");
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
    fs.writeFileSync("data.json", JSON.stringify({ users }), "utf-8");
    res.status(200).json({ message: "User deleted successfully", user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

module.exports = {
  createUser,
  loginUser,
  authenticateToken,
  getUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
};
