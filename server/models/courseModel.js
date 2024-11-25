import mongoose from "mongoose";
import courseDataSchema from "./courseDataSchema.js";
import reviewSchema from "./reviewModel.js";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    categories: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnail: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    demoUrl: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    purchased: {
      type: Number,
      default: 0,
    },
    courseData: [courseDataSchema],
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

const coursesModel = mongoose.model("courses", courseSchema);
export default coursesModel;
