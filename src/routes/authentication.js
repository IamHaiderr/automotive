const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../models/authenticationSchema");
const User = require("../models/usersSchema");
const router = require("express").Router();

const crypto = require("crypto");
const secretKey = crypto.randomBytes(32).toString("hex");

// Register API
router.post("/register", async (req, res) => {
  // Check if user already exists with the same username
  const existingUser = await Auth.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(409).send("User with this email already exists");
  }

  //////// save in auth
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const auth = new Auth({
    email: req.body.email,
    password: hashedPassword,
    role: "user", // 'admin' or 'designer'
  });
  await auth.save();
  ///////save in user schema
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    dateOfBirth: req.body.dateOfBirth,
    gender: req.body.gender,
    image: req.body.image || "",
    phoneNumber: req.body.phoneNumber,
    profileImage: req.body.profileImage,
    isVerified: false, // Assuming newly registered users are not initially verified
    address: {
      street: req.body.street,
      city: req.body.city,
      state: req.body.state,
      postalCode: req.body.postalCode,
      country: req.body.country,
    },
  });

  const response = await user.save();

  const token = jwt.sign(
    { email: user.email, id: user._id },
    process.env.SECRET_KEY
  );

  /////
  res.status(201).json({
    user: response,
    token: token,
  });
});

// Login API
router.post("/login", async (req, res) => {
  try {
    const user = await Auth.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Cannot find user");
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { email: user.email, id: user._id },
        process.env.SECRET_KEY
      );
      res.json({ token });
    } else {
      res.send("Authentication failed");
    }
  } catch {
    res.status(500).send();
  }
});

// Admin Login API
router.post("/admin/login", async (req, res) => {
  try {
    const admin = await Auth.findOne({
      email: req.body.email,
      role: "admin",
    });
    if (!admin) {
      return res.status(400).send("Cannot find admin");
    }
    if (await bcrypt.compare(req.body.password, admin.password)) {
      const token = jwt.sign(
        { email: admin.email, id: admin._id },
        process.env.SECRET_KEY
      );
      res.json({ token });
    } else {
      res.send("Authentication failed");
    }
  } catch {
    res.status(500).send();
  }
});

module.exports = router;
