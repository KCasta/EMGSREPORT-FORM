import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  // 🧹 Clear the JWT cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
