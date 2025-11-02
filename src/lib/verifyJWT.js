import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function verifyJWT(req) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.email) return null;

    return decoded;
  } catch (err) {
    return null;
  }
}

export async function requireAuth(req) {
  const user = await verifyJWT(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return user;
}
