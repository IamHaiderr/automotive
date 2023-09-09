const Appointment = require("../models/appointmentsSchema");
const router = require("express").Router();
const authenticateJWT = require("../middlewares/authentication");

// createing appointment
router.post("/craeteAppoitment", async (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the appointment." });
  }
});
// get all appointments new
router.get("/getAllAppointments", async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving appointments." });
  }
});
// get appointment by ID
router.get("/getAppoitmentById/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    res.status(200).json(appointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the appointment." });
  }
});

// update appointment by id

router.put("/updateAppointment/:id", async (req, res) => {
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the appointment." });
  }
});

// Delete appointment by ID
router.delete("/deleteAppointment/:id", async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndRemove(
      req.params.id
    );
    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    res.status(204).end();
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the appointment." });
  }
});

module.exports = router;
