
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  fullName: String,
  email: { type: String, unique: true },
  password: String,
  avatar: String,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default mongoose.models.User || mongoose.model("User", userSchema);
