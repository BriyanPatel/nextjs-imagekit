import {getMedia} from "@/actions";
import {getUserSubscriptionInfo} from "@/actions/subscription.action";
import NotFound from "@/app/not-found";
import StudioClient from "@/components/studio/studio-client";

const Studio = async ({params}: RouteParams) => {
  const {id} = await params;
  const media = await getMedia({id});
  const userInfo = await getUserSubscriptionInfo();

  if (!media.data) {
    return <NotFound />;
  }

  if (!userInfo.success) {
    return <NotFound />;
  }

  return (
    <div className="h-full flex flex-col justify-center">
      <StudioClient media={media.data} userPlan={userInfo.data.user.plan} />
    </div>
  );
};

export default Studio;
