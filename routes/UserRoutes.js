const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  registerUser,
  activateUser,
  loginUser,
  getUser,
  logoutUser,
  updateUser,
} = require("../controllers/userController");

router.post("/register", registerUser);
router.get("/activate/:activeToken", activateUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUser);
router.get("/logout", protect, logoutUser);
router.put("/update", protect, updateUser);

module.exports = router;
