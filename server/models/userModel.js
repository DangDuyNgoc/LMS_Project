import mongoose from "mongoose";

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          return emailRegexPattern.test(value);
        },
      },
      unique: true,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        coursesId: String,
      },
    ],
  },
  { timestamps: true }
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
