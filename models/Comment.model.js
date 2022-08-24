const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
