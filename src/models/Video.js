import mongoose from "mongoose";

// Schema
const videoSchema = new mongoose.Schema({
  path: { type: String, required: true },
  thumbPath: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 50 },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 200, minlength: 5 },
  createdAt: { type: Date, default: Date.now, required: true },
  hashtags: [{ type: String, trim: true }],
  meta: {
    likes: { type: Number, default: 0, required: true },
    views: { type: Number, default: 0, required: true },
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

// Middleware - Schema Statics
videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const videoModel = mongoose.model("Video", videoSchema);
export default videoModel;
