import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/connectDB";
import User from "@/models/user.model.js";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("accessToken")?.value;
    
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { fullName, email, password, avatar } = await req.json();

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (password) user.password = password;
    if (avatar) user.avatar = avatar;

    await user.save();
    return NextResponse.json({ message: "User updated successfully", user });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
