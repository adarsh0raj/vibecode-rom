import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Check if username and password match either of our two authorized users
    const isUser1 = username === process.env.AUTH_USERNAME_1 && password === process.env.AUTH_PASSWORD_1;
    const isUser2 = username === process.env.AUTH_USERNAME_2 && password === process.env.AUTH_PASSWORD_2;
    
    if (!isUser1 && !isUser2) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" }, 
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = jwt.sign(
      { username, authorized: true },
      process.env.NEXTAUTH_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );
    
    // Create response with success status
    const response = NextResponse.json({ success: true });
    
    // Set auth cookie directly on the response
    response.cookies.set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}