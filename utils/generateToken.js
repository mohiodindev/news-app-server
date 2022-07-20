const jwt = require("jsonwebtoken");

const secret = process.env.jWT_SECRET;

// Generate a token for a user
const generateToken = (payload) => {
  return jwt.sign(payload, secret, {
    expiresIn: "30d",
  });
};

module.exports = generateToken;
