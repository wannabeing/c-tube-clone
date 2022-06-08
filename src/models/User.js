import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: { type: String },
  socialLogin: { type: Boolean, default: false },
  name: { type: String, required: true, maxlength: 8 },
  gender: { type: String, default: null, required: true },
  birth: { type: String, default: null, maxlength: 4, minlength: 4 },
  myVideos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

// Schema Middleware
userSchema.pre("save", async function () {
  // 비밀번호가 변경될 때만 Hash 처리 함
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});

// Schema Statics

const userModel = mongoose.model("User", userSchema);
export default userModel;
