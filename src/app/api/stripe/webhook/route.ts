import {NextRequest, NextResponse} from "next/server";

import {eq} from "drizzle-orm";

import {db} from "@/db";
import {users} from "@/db/schema/users";
import {env} from "@/env";
import {PLANS, stripe} from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({error: "No signature"}, {status: 400});
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.userId;

        if (userId && session.customer) {
          await db
            .update(users)
            .set({
              plan: "pro",
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
              uploadLimit: PLANS.PRO.uploadLimit,
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        await db
          .update(users)
          .set({
            plan: "free",
            stripeSubscriptionId: null,
            uploadLimit: PLANS.FREE.uploadLimit,
          })
          .where(eq(users.stripeSubscriptionId, subscription.id));
        break;
      }
    }

    return NextResponse.json({received: true});
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({error: "Webhook error"}, {status: 400});
  }
}
