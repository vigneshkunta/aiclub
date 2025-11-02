import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";
import { verifyJWT } from "@/lib/verifyJWT";

export async function POST(req) {
  try {
    await dbConnect();
    const tokenData = await verifyJWT(req);
    if (!tokenData) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { postId } = await req.json();
    const user = await User.findOne({ email: tokenData.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (!user.saved.includes(postId)) {
      user.saved.push(postId);
      await user.save();
    }

    return NextResponse.json({ message: "Post saved successfully" }, { status: 200 });
  } catch (err) {
    console.error("Save post error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
