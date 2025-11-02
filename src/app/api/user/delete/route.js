import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await dbConnect();
    const token = req.cookies.get("accessToken")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByIdAndDelete(decoded._id);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
