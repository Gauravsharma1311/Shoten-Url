const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

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

  const newUser = new User({
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
  });

  try {
    const savedUser = await newUser.save();
    res
      .status(201)
      .json({ message: "User successfully created", user: savedUser });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials: User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid credentials: Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during login:", error); // Log the error details
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
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

const fetchUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  try {
    const users = await User.find().limit(limit).skip(startIndex).exec();
    const totalUsers = await User.countDocuments().exec();
    res.json({
      pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (user) {
      res.json({ message: "User found", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user by ID", error });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (user) {
      res.json({ message: "User updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const updateUserPartial = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (user) {
      res.json({ message: "User updated successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.json({ message: "User deleted successfully", user });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

module.exports = {
  createUser,
  loginUser,
  authenticateToken,
  fetchUsers,
  getUserById,
  updateUser,
  updateUserPartial,
  deleteUser,
};
