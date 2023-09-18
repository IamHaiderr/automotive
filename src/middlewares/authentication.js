const User = require("../models/usersSchema");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const authenticateJWT = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log(decodedToken);
    const user = await User.findById(decodedToken.id);
    

    if (!user) return res.status(403).json({ error: "Forbidden" });

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ error: "Forbidden" });
  }
};

module.exports = authenticateJWT;
