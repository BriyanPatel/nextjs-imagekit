import {Palette, Settings, Sparkles} from "lucide-react";

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
import {Enhancements} from "@/types/image-transformations";

type EnhancementsPanelProps = {
  transforms: Enhancements;
  onTransformChange: (transforms: Enhancements) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function EnhancementsPanel({
  transforms,
  onTransformChange,
}: EnhancementsPanelProps) {
  const update = (patch: Partial<Enhancements>) => {
    onTransformChange({...transforms, ...patch});
  };

  const updateShadow = (
    patch: Partial<NonNullable<Enhancements["shadow"]>>
  ) => {
    update({
      shadow: {
        ...transforms.shadow,
        ...patch,
      },
    });
  };

  const updateBackground = (
    patch: Partial<NonNullable<Enhancements["background"]>>
  ) => {
    update({
      background: {
        ...transforms.background,
        ...patch,
      },
    });
  };

  return (
    <div className="h-full flex flex-col md:overflow-y-scroll space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <Accordion type="multiple">
        <AccordionItem value="basic">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Settings className="size-4" />
              Basic Effects
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Blur: {transforms.blur || 0}
              </Label>
              <Slider
                value={[transforms.blur || 0]}
                onValueChange={([value]) => update({blur: value || undefined})}
                max={100}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">
                Sharpen: {transforms.sharpen || 0}
              </Label>
              <Slider
                value={[transforms.sharpen || 0]}
                onValueChange={([value]) =>
                  update({sharpen: value || undefined})
                }
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Contrast</Label>
              <Switch
                checked={!!transforms.contrast}
                onCheckedChange={checked => update({contrast: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Grayscale</Label>
              <Switch
                checked={!!transforms.grayscale}
                onCheckedChange={checked => update({grayscale: checked})}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="shadow">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Shadow Effects
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Enable Shadow</Label>
              <Switch
                checked={!!transforms.shadow}
                onCheckedChange={checked =>
                  update({
                    shadow: checked
                      ? {blur: 10, saturation: 30, offsetX: 2, offsetY: 2}
                      : undefined,
                  })
                }
              />
            </div>

            {transforms.shadow && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Blur: {transforms.shadow.blur || 10}
                  </Label>
                  <Slider
                    value={[transforms.shadow.blur || 10]}
                    onValueChange={([value]) => updateShadow({blur: value})}
                    max={15}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Saturation: {transforms.shadow.saturation || 30}%
                  </Label>
                  <Slider
                    value={[transforms.shadow.saturation || 30]}
                    onValueChange={([value]) =>
                      updateShadow({saturation: value})
                    }
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">X Offset</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={transforms.shadow.offsetX || ""}
                      onChange={e =>
                        updateShadow({
                          offsetX: e.target.value
                            ? parseInt(e.target.value)
                            : 2,
                        })
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Y Offset</Label>
                    <Input
                      type="number"
                      placeholder="2"
                      value={transforms.shadow.offsetY || ""}
                      onChange={e =>
                        updateShadow({
                          offsetY: e.target.value
                            ? parseInt(e.target.value)
                            : 2,
                        })
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="background">
          <AccordionTrigger className="py-3 cursor-pointer">
            <div className="flex items-center gap-2">
              <Palette className="size-4" />
              Background
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 px-0.5">
            <div className="space-y-2">
              <Label className="text-xs font-medium">Background Type</Label>
              <Select
                value={transforms.background?.type || "solid"}
                onValueChange={value =>
                  updateBackground({
                    type: value as "solid" | "blurred" | "dominant",
                  })
                }
              >
                <SelectTrigger className={inputStyles} style={gradientBg}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="blurred">Blurred</SelectItem>
                  <SelectItem value="dominant">Dominant Color</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {transforms.background?.type === "solid" && (
              <div className="space-y-2">
                <Label className="text-xs font-medium">Color (Hex)</Label>
                <Input
                  placeholder="FFFFFF"
                  value={transforms.background?.color || ""}
                  onChange={e => updateBackground({color: e.target.value})}
                  className={inputStyles}
                  style={gradientBg}
                />
              </div>
            )}

            {transforms.background?.type === "blurred" && (
              <>
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Blur Intensity</Label>
                  <Select
                    value={
                      transforms.background?.blurIntensity?.toString() || "auto"
                    }
                    onValueChange={value =>
                      updateBackground({
                        blurIntensity:
                          value === "auto" ? "auto" : parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className={inputStyles} style={gradientBg}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto</SelectItem>
                      {Array.from({length: 21}, (_, i) => i * 5).map(val => (
                        <SelectItem key={val} value={val.toString()}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-medium">
                    Brightness: {transforms.background?.brightness || 0}
                  </Label>
                  <Slider
                    value={[transforms.background?.brightness || 0]}
                    onValueChange={([value]) =>
                      updateBackground({brightness: value})
                    }
                    max={255}
                    min={-255}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="ghost"
        onClick={() => onTransformChange({})}
        className="w-full rounded-full mt-4"
      >
        Reset All Enhancements
      </Button>
    </div>
  );
}
