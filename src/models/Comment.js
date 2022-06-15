import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video ",
    required: true,
  },
});

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
