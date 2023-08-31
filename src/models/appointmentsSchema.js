const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  vehicle: { type: String, required: true },
  date: { type: Date, required: true },
  // Add other fields as needed
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
