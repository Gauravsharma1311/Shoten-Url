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
    domain,
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
    domain,
  });

  try {
    const savedUser = await newUser.save();
    const user = savedUser.toObject();
    delete user.__v;
    res
      .status(201)
      .json({ message: "User successfully created", user, status: 201 });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating user", error, status: 400 });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username }).select("-__v");
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials: User not found", status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid credentials: Incorrect password",
        status: 400,
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
      {
        expiresIn: "48h",
      }
    );
    res.json({ message: "Login successful", token, status: 200 });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ message: "Error logging in", error: error.message, status: 500 });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.status(401).json({
      error: {
        code: "UNAUTHENTICATED",
        message: "Invalid token",
      },
      status: 401,
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        error: {
          code: "UNAUTHENTICATED",
          message: "Invalid token",
        },
        status: 401,
      });
    }
    req.user = user;
    next();
  });
};

const fetchUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  try {
    const users = await User.find()
      .select("-__v")
      .limit(limit)
      .skip(startIndex)
      .exec();
    const totalUsers = await User.countDocuments().exec();

    const usersWithoutAddressId = users.map((user) => {
      const userObj = user.toObject();
      if (userObj.address) {
        delete userObj.address._id;
      }
      return userObj;
    });

    res.json({
      message: "Users fetched successfully",
      pagination: {
        page,
        limit,
        startIndex,
        endIndex: endIndex > totalUsers ? totalUsers : endIndex,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      users: usersWithoutAddressId,
      status: 200,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error, status: 500 });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-__v");
    if (user) {
      const userObj = user.toObject();
      delete userObj.__v;
      if (userObj.address) {
        delete userObj.address._id;
      }
      res.json({ message: "User found", user: userObj, status: 200 });
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user by ID", error, status: 500 });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    }).select("-__v");
    if (user) {
      const userObj = user.toObject();
      if (userObj.address) {
        delete userObj.address._id;
      }
      res.json({
        message: "User updated successfully",
        user: userObj,
        status: 200,
      });
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error, status: 500 });
  }
};

const updateUserPartial = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    ).select("-__v");
    if (user) {
      const userObj = user.toObject();
      if (userObj.address) {
        delete userObj.address._id;
      }
      res.json({
        message: "User updated successfully",
        user: userObj,
        status: 200,
      });
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error, status: 500 });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findByIdAndDelete(id).select("-__v");
    if (user) {
      res.json({ message: "User deleted successfully", user, status: 200 });
    } else {
      res.status(404).json({ message: "User not found", status: 404 });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error, status: 500 });
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
