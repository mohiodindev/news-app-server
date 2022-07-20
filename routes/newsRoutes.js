const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");

const {
  createNews,
  getNewsById,
  updateNews,
  deleteNews,
  commentNews,
  deleteComment,
  getAllNews,
  getNewsByCategory,
  addView,
  getNewsByAddToSlider,
  deleteNewsById,
} = require("../controllers/NewsController");

router.post("/createNews", protect, createNews);
router.get("/:id", protect, getNewsById);
router.put("/updateNews/:id", protect, updateNews);
router.delete("/deleteNews/:id", protect, deleteNews);
router.post("/commentNews/:id", protect, commentNews);
router.delete("/deleteComment/:id/:commentId", protect, deleteComment);
router.get("/getAllNews", protect, getAllNews);
router.get("/getNewsByCategory/:id", protect, getNewsByCategory);
router.post("/addView/:id", protect, addView);
router.get("/getNewsByAddToSlider", protect, getNewsByAddToSlider);
router.delete("/deleteNewsById/:id", protect, deleteNewsById);

module.exports = router;
