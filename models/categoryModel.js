const mongoose = require("mongoose");

// create category schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// create category model
module.exports.Category = mongoose.model("Category", categorySchema);
