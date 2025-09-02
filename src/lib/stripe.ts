import Stripe from "stripe";

import {env} from "@/env";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    uploadLimit: 2,
    priceId: null,
  },
  PRO: {
    name: "Pro",
    price: 999, // $9.99 in cents
    uploadLimit: 100,
    priceId: "price_1234567890", // Replace with actual Stripe price ID
  },
} as const;
