import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true },
  birth: { type: String, require: true },
  hobby: String,
});

// Schema Middleware
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

// Schema Statics

const userModel = mongoose.model("User", userSchema);
export default userModel;
