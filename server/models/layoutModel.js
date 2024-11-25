import mongoose from "mongoose";
import faqItemSchema from "./faqItemSchema.js";
import categorySchema from "./categorySchema.js";
import bannerImageSchema from "./bannerImageSchema.js";

const layoutSchema = new mongoose.Schema({
  type: {
    type: String,
  },
  faq: [faqItemSchema],
  categories: [categorySchema],
  banner: {
    image: bannerImageSchema,
    title: {
      type: String,
    },
    subTitle: {
      type: String,
    },
  },
});

const layoutModel = mongoose.model("layout", layoutSchema);

export default layoutModel;
