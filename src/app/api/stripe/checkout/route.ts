import {NextRequest, NextResponse} from "next/server";

import {getCurrentUser} from "@/lib/auth";
import {PLANS, stripe} from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {error: "Authentication required"},
        {status: 401}
      );
    }

    // Create or get the price
    let priceId = PLANS.PRO.priceId;

    if (priceId === "price_1234567890") {
      // Create a product and price if not exists
      const product = await stripe.products.create({
        name: "Pro Plan",
        description: "Unlimited uploads and premium features",
      });

      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: PLANS.PRO.price,
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });

      priceId = price.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/`,
      metadata: {
        userId: user.userId,
      },
    });

    return NextResponse.json({sessionId: session.id});
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {error: "Failed to create checkout session"},
      {status: 500}
    );
  }
}
