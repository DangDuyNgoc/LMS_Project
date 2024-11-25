import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
    title: String,
    url: String,
});

export default linkSchema;