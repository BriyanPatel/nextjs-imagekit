import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

import bcrypt from "bcryptjs";
import {eq} from "drizzle-orm";
import jwt from "jsonwebtoken";

import {db} from "@/db";
import {users} from "@/db/schema/users";

export async function POST(request: NextRequest) {
  try {
    const {email, password} = await request.json();

    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user[0] || !(await bcrypt.compare(password, user[0].password))) {
      return NextResponse.json({message: "Invalid credentials"}, {status: 401});
    }

    const token = jwt.sign(
      {userId: user[0].id, email: user[0].email},
      process.env.JWT_SECRET!,
      {expiresIn: "7d"}
    );

    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({message: "Login successful"});
  } catch (error) {
    console.log(error, "LOGIN_ERROR");
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}
