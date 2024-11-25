import mongoose from "mongoose";
import linkSchema from "./linkSchema.js";
import commentSchema from "./commentSchema.js";

const courseDataSchema = new mongoose.Schema({
  videoUrl: String,
  title: String,
  description: String,
  videoPlayer: String,
  videoSection: String,
  suggestion: String,
  videoLength: Number,
  videoThumbnail: Object,
  links: [linkSchema],
  questions: [commentSchema],
});

export default courseDataSchema;
