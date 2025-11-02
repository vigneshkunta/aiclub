import { NextResponse } from "next/server";
import { dbConnect } from "@/utils/config/db.js";
import { verifyJWT } from "@/lib/verifyJWT";
import User from "@/models/user.model.js";
import Post from "@/models/post.model.js";

export async function POST(req) {
  try {
    await dbConnect();

    const tokenData = await verifyJWT(req);
    if (!tokenData) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await User.findOne({ email: tokenData.email });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { scenario } = await req.json();
    if (!scenario) {
      return NextResponse.json({ error: "Missing 'scenario' field" }, { status: 400 });
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    // Call Gemini API to generate poem
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Write a short 4 line poem about the given description/scenario : ${scenario}` }] }],
      }),
    });

    const data = await response.json();
    const generatedPoem =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from Gemini";

    const newPost = await Post.create({
      user: dbUser._id,      
      scenario,
      poem: generatedPoem,   
    });

    dbUser.history.push(newPost._id);
    await dbUser.save();

    return NextResponse.json(
      { generatedPoem, postId: newPost._id },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error generating poem:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
