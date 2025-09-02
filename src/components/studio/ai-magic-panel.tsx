import {Crop, Eye, Sparkles, Wand2} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {AiMagic} from "@/types/image-transformations";

type AiMagicPanelProps = {
  transforms: AiMagic;
  onTransformChange: (transforms: AiMagic) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function AiMagicPanel({
  transforms,
  onTransformChange,
}: AiMagicPanelProps) {
  const update = (patch: Partial<AiMagic>) => {
    onTransformChange({...transforms, ...patch});
  };

  const updateBackground = (
    patch: Partial<NonNullable<AiMagic["background"]>>
  ) => {
    update({
      background: {
        ...transforms.background,
        ...patch,
      },
    });
  };

  const updateEditing = (patch: Partial<NonNullable<AiMagic["editing"]>>) => {
    update({
      editing: {
        ...transforms.editing,
        ...patch,
      },
    });
  };

  const updateShadowLighting = (
    patch: Partial<NonNullable<AiMagic["shadowLighting"]>>
  ) => {
    update({
      shadowLighting: {
        ...transforms.shadowLighting,
        ...patch,
      },
    });
  };

  const updateGeneration = (
    patch: Partial<NonNullable<AiMagic["generation"]>>
  ) => {
    update({
      generation: {
        ...transforms.generation,
        ...patch,
      },
    });
  };

  const updateCropping = (patch: Partial<NonNullable<AiMagic["cropping"]>>) => {
    update({
      cropping: {
        ...transforms.cropping,
        ...patch,
      },
    });
  };

  return (
    <div className="h-full flex flex-col md:overflow-y-scroll space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <Accordion type="multiple">
        <AccordionItem value="background">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Eye className="size-4" />
              Background Magic
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Remove Background</Label>
              <Switch
                checked={transforms.background?.remove || false}
                onCheckedChange={checked => updateBackground({remove: checked})}
              />
            </div>

            {transforms.background?.remove && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Mode</Label>
                <Select
                  value={transforms.background?.mode || "standard"}
                  onValueChange={value =>
                    updateBackground({mode: value as "standard" | "economy"})
                  }
                >
                  <SelectTrigger className={inputStyles} style={gradientBg}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">
                      Standard (130 units)
                    </SelectItem>
                    <SelectItem value="economy">Economy (10 units)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-xs font-medium">Change Background</Label>
              <Textarea
                placeholder="Describe the new background..."
                value={transforms.background?.changePrompt || ""}
                onChange={e => updateBackground({changePrompt: e.target.value})}
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="editing">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Wand2 className="size-4" />
              AI Editing
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Edit Prompt</Label>
              <Textarea
                placeholder="Describe what to edit in the image..."
                value={transforms.editing?.prompt || ""}
                onChange={e => updateEditing({prompt: e.target.value})}
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Retouch (5 units)</Label>
              <Switch
                checked={transforms.editing?.retouch || false}
                onCheckedChange={checked => updateEditing({retouch: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Upscale (5 units)</Label>
              <Switch
                checked={transforms.editing?.upscale || false}
                onCheckedChange={checked => updateEditing({upscale: checked})}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shadow">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI Drop Shadow
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Azimuth: {transforms.shadowLighting?.dropShadow?.azimuth || 215}
                °
              </Label>
              <Slider
                value={[transforms.shadowLighting?.dropShadow?.azimuth || 215]}
                onValueChange={([value]) =>
                  updateShadowLighting({
                    dropShadow: {
                      ...transforms.shadowLighting?.dropShadow,
                      azimuth: value,
                    },
                  })
                }
                max={360}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Elevation:{" "}
                {transforms.shadowLighting?.dropShadow?.elevation || 45}°
              </Label>
              <Slider
                value={[transforms.shadowLighting?.dropShadow?.elevation || 45]}
                onValueChange={([value]) =>
                  updateShadowLighting({
                    dropShadow: {
                      ...transforms.shadowLighting?.dropShadow,
                      elevation: value,
                    },
                  })
                }
                max={90}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Saturation:{" "}
                {transforms.shadowLighting?.dropShadow?.saturation || 60}%
              </Label>
              <Slider
                value={[
                  transforms.shadowLighting?.dropShadow?.saturation || 60,
                ]}
                onValueChange={([value]) =>
                  updateShadowLighting({
                    dropShadow: {
                      ...transforms.shadowLighting?.dropShadow,
                      saturation: value,
                    },
                  })
                }
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="generation">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              AI Generation
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Generate from Text (65 units)
              </Label>
              <Textarea
                placeholder="Describe the image to generate..."
                value={transforms.generation?.textPrompt || ""}
                onChange={e => updateGeneration({textPrompt: e.target.value})}
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">
                Generate Variation (25 units)
              </Label>
              <Switch
                checked={transforms.generation?.variation || false}
                onCheckedChange={checked =>
                  updateGeneration({variation: checked})
                }
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cropping">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Crop className="size-4" />
              Smart Cropping
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Crop Type</Label>
              <Select
                value={transforms.cropping?.type || "smart"}
                onValueChange={value =>
                  updateCropping({type: value as "smart" | "face" | "object"})
                }
              >
                <SelectTrigger className={inputStyles} style={gradientBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart">Smart Crop (Free)</SelectItem>
                  <SelectItem value="face">Face Crop (Free)</SelectItem>
                  <SelectItem value="object">Object Crop (Free)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transforms.cropping?.type === "object" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Object Name</Label>
                <Input
                  placeholder="e.g., dog, car, person"
                  value={transforms.cropping?.objectName || ""}
                  onChange={e => updateCropping({objectName: e.target.value})}
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-medium">Width</Label>
                <Input
                  type="number"
                  placeholder="Auto"
                  value={transforms.cropping?.width || ""}
                  onChange={e =>
                    updateCropping({
                      width: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium">Height</Label>
                <Input
                  type="number"
                  placeholder="Auto"
                  value={transforms.cropping?.height || ""}
                  onChange={e =>
                    updateCropping({
                      height: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="ghost"
        onClick={() => onTransformChange({})}
        className="w-full rounded-full mt-4"
      >
        Reset All AI Magic
      </Button>
    </div>
  );
}
