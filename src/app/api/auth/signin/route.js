import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await user.isPasswordCorrect(password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = user.generateAccessToken();

    const res = NextResponse.json({ message: "Login successful", user }, { status: 200 });
    res.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
