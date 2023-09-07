const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    image: { type: Array, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const VehicleSchema = mongoose.model("myVehicles", vehicleSchema);

module.exports = VehicleSchema;
