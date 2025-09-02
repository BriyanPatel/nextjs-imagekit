"use server";

import {cache} from "react";

import {count, eq} from "drizzle-orm";

import {db} from "@/db";
import {media} from "@/db/schema/media";
import {users} from "@/db/schema/users";
import {getCurrentUser} from "@/lib/auth";
import {handleError} from "@/lib/handlers";

export const getUserSubscriptionInfo = cache(
  async (): Promise<
    ActionResponse<{
      user: {plan: string; uploadLimit: number};
      uploadCount: number;
    }>
  > => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        throw new Error("Authentication required");
      }

      const [userRecord] = await db
        .select({
          plan: users.plan,
          uploadLimit: users.uploadLimit,
        })
        .from(users)
        .where(eq(users.id, currentUser.userId))
        .limit(1);

      if (!userRecord) {
        throw new Error("User not found");
      }

      const [uploadCountResult] = await db
        .select({count: count()})
        .from(media)
        .where(eq(media.userId, currentUser.userId));

      const uploadCount = uploadCountResult?.count || 0;

      return {
        success: true,
        data: {
          user: userRecord,
          uploadCount,
        },
      };
    } catch (error) {
      return handleError(error) as ErrorResponse;
    }
  }
);
