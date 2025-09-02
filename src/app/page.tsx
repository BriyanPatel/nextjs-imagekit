import {Suspense} from "react";

import {getAllMedia} from "@/actions";
import {getUserSubscriptionInfo} from "@/actions/subscription.action";
import GridLoader from "@/components/media/grid-loader";
import MasonryGrid from "@/components/media/masonry-grid";
import SubscriptionStatus from "@/components/subscription/subscription-status";
import {getCurrentUser} from "@/lib/auth";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <div className="mt-12 sm:mt-20 sm:text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 md:text-6xl lg:text-7xl dark:text-white">
          Your personal{" "}
          <span className="font-montserrat bg-gradient-to-r from-pink-500 to-pink-700 bg-clip-text tracking-tight text-transparent dark:from-pink-400 dark:to-pink-600">
            memory vault
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
          Upload, transform, and manage your photos and videos with AI-powered
          tools. Create stunning visuals with just a few clicks.
        </p>
      </div>

      {user && (
        <div className="mt-12 mb-8">
          <Suspense fallback={<div>Loading subscription info...</div>}>
            <SubscriptionInfo />
          </Suspense>
        </div>
      )}

      <h2 className="mt-20 mb-2 text-2xl font-medium text-gray-900 sm:mt-32 dark:text-white">
        Your Media Collection
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Click on any item to edit and transform it
      </p>

      <Suspense fallback={<GridLoader />}>
        <MediaGrid />
      </Suspense>
    </>
  );
}

async function SubscriptionInfo() {
  const result = await getUserSubscriptionInfo();

  if (!result.success) {
    return null;
  }

  return <SubscriptionStatus {...result.data} />;
}

async function MediaGrid() {
  const result = await getAllMedia({page: 1, pageSize: 50});

  if (!result.success) {
    return (
      <div className="py-24 text-center">
        <h3 className="mb-2 text-lg">Oops, failed to load media try again.</h3>
        <p className="text-gray-500">
          {result.error?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return <MasonryGrid media={result.data!.media} />;
}
