const mongooose = require("mongoose");

// create news schema
const newsSchema = new mongooose.Schema(
  {
    author: {
      type: String,
      default: "Admin",
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      default: "",
    },
    newsImage: [String],
    category: {
      type: mongooose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: {
          type: mongooose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    addedAt: {
      type: Date,
      default: Date.now,
    },
    addToSlider: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// create news model
module.exports.News = mongooose.model("News", newsSchema);
