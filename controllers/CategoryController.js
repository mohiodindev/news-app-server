const { Category } = require("../models/categoryModel");

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      success: true,
      msg: "Categories fetched successfully",
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting categories",
      error: error.msg,
    });
  }
};

// @route   POST api/categories
// @desc    Create a category
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, msg: "Please enter a name" });

    // check if category already exists
    const existcategory = await Category.findOne({ name });
    if (existcategory)
      return res
        .status(400)
        .json({ success: false, msg: "Category already exists" });

    const category = new Category({ name });
    await category.save();
    res.status(200).json({
      success: true,
      msg: "Category created successfully",
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error creating category",
      error: error.msg,
    });
  }
};

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(400)
        .json({ success: false, msg: "Category does not exist" });
    if (!name)
      return res
        .status(400)
        .json({ success: false, msg: "Please enter a name" });
    category.name = name;
    await category.save();
    res.status(200).json({
      success: true,
      msg: "Category updated successfully",
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error updating category",
      error: error.msg,
    });
  }
};

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(400)
        .json({ success: false, msg: "Category does not exist" });
    await category.remove();
    res.status(200).json({
      success: true,
      msg: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error deleting category",
      error: error.msg,
    });
  }
};

// @route   GET api/categories/:id
// @desc    Get a category
// @access  Private
const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res
        .status(400)
        .json({ success: false, msg: "Category does not exist" });
    res.status(200).json({
      success: true,
      msg: "Category fetched successfully",
      category: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: "Error getting category",
      error: error.msg,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategory,
};
