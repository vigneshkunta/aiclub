import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";

export async function POST(req) {
  try {
    await dbConnect();
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    return NextResponse.json({ message: "Signup successful", user: newUser }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: err.message || "Internal server error" }, { status: 500 });
  }
}
