import {NextResponse} from "next/server";

import {getUploadAuthParams} from "@imagekit/next/server";

import {env} from "@/env";
import {getCurrentUser} from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    console.log(user, "CURRENT_USER");
    if (!user) {
      return NextResponse.json(
        {error: "Authentication required"},
        {status: 401}
      );
    }

    const {token, expire, signature} = getUploadAuthParams({
      privateKey: env.IMAGEKIT_PRIVATE_KEY,
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Upload auth error:", error);
    return NextResponse.json(
      {error: "Failed to generate upload authentication parameters"},
      {status: 500}
    );
  }
}
