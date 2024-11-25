import mongoose from "mongoose";

const bannerImageSchema = new mongoose.Schema({
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
});

export default bannerImageSchema;
