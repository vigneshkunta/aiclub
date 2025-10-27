import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Signout successful" }, { status: 200 });

  res.cookies.set("accessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res;
}
