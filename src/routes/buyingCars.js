const router = require("express").Router();
const Car = require("../models/carSchema");
const Vehicle = require("../models/myVehiclesSchema");
const PaymentHistory = require("../models/paymentSchema");
const authenticateJWT = require("../middlewares/authentication");

// List cars available for direct purchase
router.get("/buy-cars", authenticateJWT, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page, default to 1
    const perPage = parseInt(req.query.perPage) || 10; // Number of items per page, default to 10

    // Calculate the skip value based on the current page and items per page
    const skip = (page - 1) * perPage;

    // Retrieve cars with the 'available' status from the database with pagination
    const carsForDirectPurchase = await Car.find({ status: "available" })
      .skip(skip) // Skip the appropriate number of items
      .limit(perPage); // Limit the results to the specified number per page

    // Respond with a 200 OK status code and the paginated list of available cars as JSON
    res.status(200).json(carsForDirectPurchase);
  } catch (error) {
    // Handle errors by responding with a 500 Internal Server Error status code and an error message
    res.status(500).json({
      error: "An error occurred while retrieving cars for direct purchase.",
    });
  }
});

// Purchase a car directly without installments & with installments
router.post("/buy-car/:id", authenticateJWT, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car || car.status !== "available") {
      return res.status(404).json({ error: "Car not available for purchase." });
    }

    if (car.installmentEligible == false) {
      // add vehicle to users own vehicles and pay without installments
      await Vehicle.create({
        userId: req.user._id,
        make: car.make,
        model: car.model,
        year: car.year,
        image: car.image,
        price: car.price,
      });
      // payment history added
      await PaymentHistory.create({
        userId: req.user._id,
        carId: car._id,
        paymentAmount: car.price,
        paymentDate: new Date(),
        paymentType: "full",
      });

      car.status = "sold";
      const updatedCar = await car.save();
      res.status(200).json(updatedCar);
    } else {
      // pay with installments

      await Vehicle.create({
        userId: req.user._id,
        make: car.make,
        model: car.model,
        year: car.year,
        image: car.image,
        price: car.price,
      });
      // payment history added
      await PaymentHistory.create({
        userId: req.user._id,
        carId: car._id,
        paymentAmount: car.installmentPlans[0].downPayment,
        paymentDate: new Date(),
        paymentType: "installment",
        pendingPayment:
          car.installmentPlans[0].months *
          car.installmentPlans[0].monthlyPayment,
        installmentPlan: car.installmentPlans,
      });

      car.status = "sold";
      const updatedCar = await car.save();
      res.status(200).json(updatedCar);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while processing the car purchase." });
  }
});

module.exports = router;
