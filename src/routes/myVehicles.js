const router = require("express").Router();
const Vehicle = require("../models/myVehiclesSchema");
const authenticateJWT = require("../middlewares/authentication");

// API route to list payments for a specific user with car details
router.get("/vehicle-details", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;

    // Pagination options
    const page = parseInt(req.query.page) || 1; // Current page (default to 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default to 10)

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Query the database with pagination options
    const vehicles = await Vehicle.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .exec();

    // Count the total number of documents for pagination
    const totalCount = await Vehicle.countDocuments({ userId });

    res.json({
      page,
      totalPages: Math.ceil(totalCount / limit),
      totalItems: totalCount,
      vehicles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
