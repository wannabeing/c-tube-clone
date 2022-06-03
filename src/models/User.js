import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  avatarUrl: { type: String },
  socialLogin: { type: Boolean, default: false },
  name: { type: String, required: true },
  gender: { type: String, default: null },
  birth: { type: String, default: null },
});

// Schema Middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

// Schema Statics

const userModel = mongoose.model("User", userSchema);
export default userModel;
