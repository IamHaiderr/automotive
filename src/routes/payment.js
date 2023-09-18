const router = require("express").Router();
const authenticateJWT = require("../middlewares/authentication");
const Payment = require("../models/paymentSchema");

// API route to list payments for a specific user with car details
router.get("/payment-details", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination options
    const page = parseInt(req.query.page) || 1; // Current page (default to 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default to 10)

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Query the database with pagination options and populate car details
    const payments = await Payment.find({ userId })
      .populate("carId")
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    // Count the total number of documents for pagination
    const totalCount = await Payment.countDocuments({ userId });

    res.json({
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      payments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
