import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema({
  question: {
    type: String,
  },
  answer: {
    type: String,
  },
});

export default faqItemSchema;
