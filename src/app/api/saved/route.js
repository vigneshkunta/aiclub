import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/verifyJWT";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model.js";
import Post from "@/models/post.model.js";

export async function GET(req) {
  try {
    await dbConnect();

    const tokenData = await verifyJWT(req);
    if (!tokenData)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await User.findOne({ email: tokenData.email });
    if (!dbUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const savedPostIds = dbUser.saved.map(item => item._id);

    const savedPosts = await Post.find({ _id: { $in: savedPostIds } })
                                 .sort({ createdAt: -1 })
                                 .populate("user", "fullName");

    return NextResponse.json({ saved: savedPosts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/saved error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
