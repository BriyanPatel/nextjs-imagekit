"use client";

import {useState} from "react";

import {Crown, Upload} from "lucide-react";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UpgradeModal from "./upgrade-modal";

interface SubscriptionStatusProps {
  user: {
    plan: string;
    uploadLimit: number;
  };
  uploadCount: number;
}

export default function SubscriptionStatus({
  user,
  uploadCount,
}: SubscriptionStatusProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const isPro = user.plan === "pro";
  const remainingUploads = user.uploadLimit - uploadCount;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown
                className={`h-5 w-5 ${isPro ? "text-yellow-500" : "text-gray-400"}`}
              />
              <CardTitle className="text-lg">
                {isPro ? "Pro Plan" : "Free Plan"}
              </CardTitle>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Active" : "Free"}
              </Badge>
            </div>
            {!isPro && (
              <Button
                onClick={() => setShowUpgradeModal(true)}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500"
              >
                Upgrade
              </Button>
            )}
          </div>
          <CardDescription>
            {isPro
              ? "Unlimited uploads and premium features"
              : "Limited to 2 uploads per account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex items-center gap-4">
            <Upload className="h-4 w-4 text-gray-500" />
            <div className="flex-1">
              <div className="flex justify-between text-sm">
                <span>Uploads Used</span>
                <span>
                  {uploadCount} / {isPro ? "∞" : user.uploadLimit}
                </span>
              </div>
              {!isPro && (
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min((uploadCount / user.uploadLimit) * 100, 100)}%`,
                    }}
                  />
                </div>
              )}
              {!isPro && remainingUploads <= 0 && (
                <p className="text-sm text-red-500 mt-2">
                  Upload limit reached. Upgrade to continue uploading.
                </p>
              )}
              {!isPro && remainingUploads > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {remainingUploads} upload{remainingUploads !== 1 ? "s" : ""}{" "}
                  remaining
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </>
  );
}
