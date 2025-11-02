import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/verifyJWT";
import { dbConnect } from "@/utils/config/db.js";
import User from "@/models/user.model";
import Post from "@/models/post.model";

export async function GET(req) {
  try {
    await dbConnect();

    const tokenData = await verifyJWT(req);
    if (!tokenData) 
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await User.findOne({ email: tokenData.email });
    if (!dbUser) 
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // console.log("User found for history retrieval:", dbUser);

    // Extract only the ObjectIds from history
    const postIds = dbUser.history.map(item => item._id);

    console.log("Post IDs extracted from user history:", postIds);

    const posts = await Post.find({ _id: { $in: postIds } })
                            .sort({ createdAt: -1 });

    // console.log("GET /api/history success for user:", posts);

    return NextResponse.json({ history: posts }, { status: 200 });
  } catch (error) {
    console.error("GET /api/history error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
