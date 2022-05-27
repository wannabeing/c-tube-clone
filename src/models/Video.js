import mongoose from "mongoose";

// Schema
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hastags: [{ type: String }],
  meta: {
    views: Number,
    rating: Number,
  },
});

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;
