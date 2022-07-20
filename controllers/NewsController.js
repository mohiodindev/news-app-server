const { News } = require("../models/NewsModel");
const { Category } = require("../models/categoryModel");
const { User } = require("../models/UserModel");
const ImageToBase64 = require("image-to-base64");

// get news by id
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting news",
      error: error.msg,
    });
  }
};

// create news
const createNews = async (req, res) => {
  try {
    const { title, author, category, content, addToSlider, newsImage } =
      req.body;
    if (!title || !category || !content) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all fields" });
    }
    const base64Image = await ImageToBase64(req.files.newsImage.path);
    // check if category valid
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ success: false, msg: "Category does not exist" });
    }
    const news = new News({
      title,
      author,
      category,
      content,
      newsImage: `data:${req.files.newsImage.type};base64,${base54Image}`,
      addedAt: Date.now(),
      addToSlider,
    });
    await news.save();
    return res.status(200).json({
      success: true,
      msg: "News created successfully",
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Error creating news",
      error: error.msg,
    });
  }
};

// update news
const updateNews = async (req, res) => {
  try {
    const { title, category, content, addToSlider } = req.body;
    const news = await News.findById(req.params.id);
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    if (!title || !category || !content) {
      return res
        .status(400)
        .json({ success: false, msg: "Please enter all fields" });
    }
    // check if category valid
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res
        .status(400)
        .json({ success: false, msg: "Category does not exist" });
    }
    const base64Image = await ImageToBase64(req.files.newsImage.path);

    news.title = title;
    news.category = category;
    news.content = content;
    news.addToSlider = addToSlider;
    news.newsImage = `data:${req.files.newsImage.type};base64,${base64Image}`;

    await news.save();
    return res.status(200).json({
      success: true,
      msg: "News updated successfully",
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Error updating news",
      error: error.msg,
    });
  }
};

// delete news
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    await news.remove();
    return res.status(200).json({
      success: true,
      msg: "News deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error deleting news",
      error: error.msg,
    });
  }
};

// comment news
const commentNews = async (req, res) => {
  try {
    const { comment } = req.body;
    const news = await News.findById(req.params.id).select("comments");
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    const user = await User.findById(req.header._id);
    news.comments.push({
      comment,
      user: user._id,
    });
    await news.save();
    return res.status(200).json({
      success: true,
      msg: "Comment added successfully",
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error adding comment",
      error: error.msg,
    });
  }
};

// delete comment
const deleteComment = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select("comments");
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    if (!news.comments.id(req.params.commentId)) {
      return res
        .status(400)
        .json({ success: false, msg: "Comment does not exist" });
    }
    news.comments.pull(req.params.commentId);
    await news.save();
    return res.status(200).json({
      success: true,
      msg: "Comment deleted successfully",
      news,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      msg: "Error deleting comment",
      error: error.msg,
    });
  }
};

// get all news
const getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting news",
      error: error.msg,
    });
  }
};

// get news by category
const getNewsByCategory = async (req, res) => {
  try {
    const news = await News.find({ category: req.params.id })
      .select("-newsImage")
      .populate("category", "name");
    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting news",
      error: error.msg,
    });
  }
};

// add view to news
const addView = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).select("views");
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    // if same user add view again
    news.views += 1;
    await news.save();
    return res.status(200).json({
      success: true,
      msg: "View added successfully",
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error adding view",
      error: error.msg,
    });
  }
};

// get news by add to slider
const getNewsByAddToSlider = async (req, res) => {
  try {
    const news = await News.find({ addToSlider: true });
    // .select("-newsImage")
    // .populate("category", "name");
    return res.status(200).json({
      success: true,
      news,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error getting news",
      error: error.msg,
    });
  }
};

// delete news by id
const deleteNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news)
      return res
        .status(400)
        .json({ success: false, msg: "News does not exist" });
    await news.remove();
    return res.status(200).json({
      success: true,
      msg: "News deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: "Error deleting news",
      error: error.msg,
    });
  }
};

module.exports = {
  createNews,
  updateNews,
  getNewsById,
  commentNews,
  deleteNews,
  deleteComment,
  getAllNews,
  getNewsByCategory,
  addView,
  getNewsByAddToSlider,
  deleteNewsById,
};
