const router = require("express").Router();
const Vehicle = require("../models/myVehiclesSchema");
const authenticateJWT = require("../middlewares/authentication");

// API route to list payments for a specific user with car details
router.get("/vehicle-details", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const vehicles = await Vehicle.find({ userId }).exec();

    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
