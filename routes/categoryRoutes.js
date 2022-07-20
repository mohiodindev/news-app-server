const express = require("express");
const router = express.Router();

const protect = require("../middlewares/authMiddleware");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
} = require("../controllers/categoryController");

router.get("/", protect, getCategories);
router.post("/createCategory", protect, createCategory);
router.put("/editCategory/:id", protect, updateCategory);
router.delete("/deleteCategory/:id", protect, deleteCategory);
router.get("/:id", protect, getCategory);

module.exports = router;
