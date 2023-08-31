const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    image: String,
    phoneNumber: String,
    profileImage: String,
    registrationDate: { type: Date, default: Date.now },
    lastLogin: Date,
    isVerified: Boolean,
    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", usersSchema);
