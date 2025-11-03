import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/verifyJWT.js";
import { dbConnect } from "@/utils/config/db.js";
import Post from "@/models/post.model.js";
import User from "@/models/user.model.js";

export async function PATCH(req, routerContext) {
  const { id } = await routerContext.params;

  if (!id)
    return NextResponse.json({ error: "Post ID required" }, { status: 400 });

  try {
    await dbConnect();
    const user = await verifyJWT(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updates = await req.json();
    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (String(post.user) !== String(user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (typeof updates.isPublic === "boolean") post.isPublic = updates.isPublic;
    if (typeof updates.showScenarioPublic === "boolean")
      post.showScenarioPublic = updates.showScenarioPublic;

    await post.save();

    return NextResponse.json(
      { message: "Post updated", post },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error updating post:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, routerContext) {
  const { id } = await routerContext.params;
  if (!id)
    return NextResponse.json({ error: "Post ID required" }, { status: 400 });

  try {
    await dbConnect();
    const user = await verifyJWT(req);
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const post = await Post.findById(id);
    if (!post)
      return NextResponse.json({ error: "Post not found" }, { status: 404 });

    if (String(post.user) !== String(user._id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(user._id, { $pull: { history: id } });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting post:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
