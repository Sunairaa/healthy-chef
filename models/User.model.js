const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, "Username is required."],
      unique: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipes" }],
    // imageUrl: {
    //   type: String,
    //   // default: String,
    // },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
