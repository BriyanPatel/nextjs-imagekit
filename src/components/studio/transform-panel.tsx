import {useState} from "react";

import {Lock} from "lucide-react";

import {type SectionKey} from "@/components/studio/dock";
import UpgradeModal from "@/components/subscription/upgrade-modal";
import {Button} from "@/components/ui/button";
import {TransformationConfig} from "@/types";

import {AiMagicPanel} from "./ai-magic-panel";
import {EnhancementsPanel} from "./enhancements-panel";
import {ImageBasicsPanel} from "./image-basics-panel";
import {OverlaysPanel} from "./overlays-panel";

type TransformPanelProps = {
  activeSection: SectionKey;
  transforms: TransformationConfig;
  userPlan: string;
  onTransformChange: (transforms: TransformationConfig) => void;
};

export function TransformPanel({
  activeSection,
  transforms,
  userPlan,
  onTransformChange,
}: TransformPanelProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = userPlan === "pro";

  const PremiumFeature = ({children}: {children: React.ReactNode}) => (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-black/90 rounded-lg">
        <Lock className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-3 text-center">Pro Feature</p>
        <Button
          size="sm"
          onClick={() => setShowUpgradeModal(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500"
        >
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
  const getSectionTitle = (section: SectionKey) => {
    switch (section) {
      case "basics":
        return "Basic Adjustments";
      case "overlays":
        return "Overlays & Effects";
      case "enhancements":
        return "Enhancements";
      case "ai":
        return "AI Magic";
      case "audio":
        return "Audio";
      default:
        return "Transform";
    }
  };

  const renderPanelContent = () => {
    switch (activeSection) {
      case "basics":
        if (transforms.type === "IMAGE") {
          return (
            <ImageBasicsPanel
              transforms={transforms.basics || {}}
              onTransformChange={b =>
                onTransformChange({...transforms, basics: b})
              }
            />
          );
        } else if (transforms.type === "VIDEO") {
          return <>Video Basics</>;
        }
      case "overlays":
        if (transforms.type === "IMAGE") {
          const content = (
            <OverlaysPanel
              transforms={transforms.overlays || []}
              onTransformChange={overlays =>
                onTransformChange({...transforms, overlays})
              }
            />
          );
          return isPro ? content : <PremiumFeature>{content}</PremiumFeature>;
        }
        return <p>Overlays & Effects</p>;
      case "enhancements":
        if (transforms.type === "IMAGE") {
          const content = (
            <EnhancementsPanel
              transforms={transforms.enhancements || {}}
              onTransformChange={enh =>
                onTransformChange({...transforms, enhancements: enh})
              }
            />
          );
          return isPro ? content : <PremiumFeature>{content}</PremiumFeature>;
        }
        return <p>Enhancements</p>;
      case "ai":
        if (transforms.type === "IMAGE") {
          const content = (
            <AiMagicPanel
              transforms={transforms.aiMagic || {}}
              onTransformChange={ai =>
                onTransformChange({...transforms, aiMagic: ai})
              }
            />
          );
          return isPro ? content : <PremiumFeature>{content}</PremiumFeature>;
        }
        return <p>AI Magic</p>;
      case "audio":
        return <p>Audio</p>;
      default:
        return (
          <div className="p-4 text-center text-gray-500">
            Select a section to get started
          </div>
        );
    }
  };

  return (
    <div className="border flex flex-col border-pink-300/30 dark:border-pink-200/15 max-md:min-h-32 md:w-1/4 rounded-xl p-6">
      <div className="flex items-center justify-between pb-4 border-gray-300/30 dark:border-white/10">
        <div className="flex items-center gap-2">
          <h3 className="flex items-center gap-2 text-xs text-foreground/60">
            {getSectionTitle(activeSection)}
          </h3>
        </div>
      </div>
      <div className="max-h-full">{renderPanelContent()}</div>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
      />
    </div>
  );
}
