import {NextResponse} from "next/server";

import {count, eq} from "drizzle-orm";

import {db} from "@/db";
import {media} from "@/db/schema/media";
import {users} from "@/db/schema/users";
import {getCurrentUser} from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({canUpload: false}, {status: 401});
    }

    const [userRecord] = await db
      .select({uploadLimit: users.uploadLimit})
      .from(users)
      .where(eq(users.id, user.userId))
      .limit(1);

    if (!userRecord) {
      return NextResponse.json({canUpload: false}, {status: 404});
    }

    const [uploadCount] = await db
      .select({count: count()})
      .from(media)
      .where(eq(media.userId, user.userId));

    const currentUploads = uploadCount?.count || 0;
    const canUpload = currentUploads < userRecord.uploadLimit;

    return NextResponse.json({
      canUpload,
      currentUploads,
      uploadLimit: userRecord.uploadLimit,
    });
  } catch {
    return NextResponse.json({canUpload: false}, {status: 500});
  }
}
