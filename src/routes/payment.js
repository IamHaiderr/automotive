const router = require("express").Router();
const authenticateJWT = require("../middlewares/authentication");
const Payment = require("../models/paymentSchema");

// API route to list payments for a specific user with car details
router.get("/payment-details", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const payments = await Payment.find({ userId })
      .populate("carId") // Populate the car details
      .exec();

    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
