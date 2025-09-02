import {NextRequest, NextResponse} from "next/server";

import bcrypt from "bcryptjs";
import {eq} from "drizzle-orm";

import {db} from "@/db";
import {users} from "@/db/schema/users";

export async function POST(request: NextRequest) {
  try {
    const {email, password, name} = await request.json();

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser[0]) {
      return NextResponse.json({message: "User already exists"}, {status: 400});
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    return NextResponse.json({message: "User created successfully"});
  } catch (error) {
    console.log(error, "SIGNUP_ERROR");
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}
