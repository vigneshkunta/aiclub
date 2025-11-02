// /app/api/explore/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import Post from "@/models/post.model.js";

export async function GET(req) {
  try {
    await dbConnect();

    const { page = 1, limit = 10 } = Object.fromEntries(new URL(req.url).searchParams);

    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("user", "fullName");

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("Explore GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
