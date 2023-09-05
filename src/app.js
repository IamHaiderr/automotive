const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authentication");
const appointmentRoutes = require("./routes/appointments")
const buyCars = require("./routes/buyingCars")
const sellCars = require("./routes/sellingCars")
const sellCarsInstallment = require("./routes/sellingCarsInstallment")

const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(express.json());
app.use(bodyParser.json());

/// ROUTES
app.use("/auth", authRoutes);
app.use("/appointment", appointmentRoutes)
app.use("/buy", buyCars)
app.use("/sell", sellCars)
app.use("/Installments", sellCarsInstallment)