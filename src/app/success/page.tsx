import Link from "next/link";

import {CheckCircle} from "lucide-react";

import {Button} from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Payment Successful!</h1>
        <p className="text-gray-600 max-w-md">
          Welcome to Pro! You now have unlimited uploads and access to all
          features.
        </p>
        <Button asChild>
          <Link href="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
