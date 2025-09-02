"use client";

import {useState} from "react";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UpgradeModal({open, onOpenChange}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        credentials: "include",
      });

      const {sessionId} = await response.json();

      // Redirect to Stripe Checkout
      const stripe = (await import("@stripe/stripe-js")).loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );

      const stripeInstance = await stripe;
      await stripeInstance?.redirectToCheckout({sessionId});
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            You've reached your upload limit. Upgrade to Pro for unlimited
            uploads.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold">Pro Plan - $9.99/month</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              <li>• Unlimited uploads</li>
              <li>• All transformation features</li>
              <li>• Priority support</li>
            </ul>
          </div>

          <Button onClick={handleUpgrade} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Upgrade Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
