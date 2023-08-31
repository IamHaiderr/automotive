const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    role: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Auth", authSchema);
