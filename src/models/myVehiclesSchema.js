const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    image: { type: Array, required: true },
    price: { type: Number, required: true },

}, {
    timestamps: true
});

const VehicleSchema = mongoose.model('myVehicles', vehicleSchema);

module.exports = VehicleSchema;
