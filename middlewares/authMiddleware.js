const jwt = require("jsonwebtoken");
const { User } = require("../models/UserModel");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.header = await User.findOne(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        code: 401,
        success: false,
        msg: error.message || "Serssion expired",
      });
    }
  }
  if (!token) {
    res.status(401).json({
      code: 401,
      success: false,
      msg: "Unauthorized",
    });
  }
};

module.exports = protect;
