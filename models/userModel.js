const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  postalCode: { type: String, required: true },
  state: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  maidenName: String,
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthDate: Date,
  image: String,
  bloodGroup: String,
  height: Number,
  weight: Number,
  eyeColor: String,
  hair: {
    type: { type: String },
    color: { type: String },
  },
  domain: String,
  ip: String,
  address: addressSchema,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
