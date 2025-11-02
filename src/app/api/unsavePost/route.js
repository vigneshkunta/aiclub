import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/verifyJWT";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";

export async function POST(req) {
  try {
    await dbConnect();

    const tokenData = await verifyJWT(req);
    if (!tokenData)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await User.findOne({ email: tokenData.email });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { postId } = await req.json();
    if (!postId)
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });

    dbUser.saved = dbUser.saved.filter((id) => id.toString() !== postId);
    await dbUser.save();

    return NextResponse.json({ message: "Post unsaved successfully" }, { status: 200 });
  } catch (err) {
    console.error("POST /api/unsavePost error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
