import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: Object,
    rating: {
        type: Number,
        default: 0
    },
    comment: String,
    commentRelies: [Object],
}, {timestamps: true});

export default reviewSchema;