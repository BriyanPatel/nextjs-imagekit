import {Image, Plus, Square, Trash2, Type} from "lucide-react";

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
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {Overlay} from "@/types/image-transformations";

type OverlaysPanelProps = {
  transforms: Overlay[];
  onTransformChange: (transforms: Overlay[]) => void;
};

const inputStyles =
  "rounded-full px-4 h-8 focus-visible:ring-0 shadow-none border-transparent ring-1 ring-pink-500/20 dark:ring-pink-400/15 dark:bg-background/50";

const gradientBg = {
  backgroundImage:
    "linear-gradient(to top left, rgba(236,72,153,0.08), rgba(236,72,153,0.00))",
};

export function OverlaysPanel({
  transforms,
  onTransformChange,
}: OverlaysPanelProps) {
  const addOverlay = (type: Overlay["type"]) => {
    const newOverlay: Overlay =
      type === "text"
        ? {type: "text", text: "Sample Text", fontSize: 24}
        : type === "image"
          ? {type: "image", src: ""}
          : type === "solid"
            ? {type: "solid", color: "FF0000", width: 200, height: 100}
            : {type: "gradient", fromColor: "FF0000", toColor: "0000FF"};

    onTransformChange([...transforms, newOverlay]);
  };

  const updateOverlay = (index: number, patch: Partial<Overlay>) => {
    const updated = transforms.map((overlay, i) =>
      i === index ? {...overlay, ...patch} : overlay
    );
    onTransformChange(updated);
  };

  const removeOverlay = (index: number) => {
    onTransformChange(transforms.filter((_, i) => i !== index));
  };

  return (
    <div className="h-full flex flex-col md:overflow-y-scroll space-y-1 scrollbar-thin scrollbar-thumb-gray-300">
      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay("text")}
          className="flex-1"
        >
          <Type className="size-3 mr-1" />
          Text
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay("image")}
          className="flex-1"
        >
          <Image className="size-3 mr-1" />
          Image
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addOverlay("solid")}
          className="flex-1"
        >
          <Square className="size-3 mr-1" />
          Solid
        </Button>
      </div>

      <Accordion type="multiple">
        {transforms.map((overlay, index) => (
          <AccordionItem key={index} value={`overlay-${index}`}>
            <AccordionTrigger className="py-3 cursor-pointer">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {overlay.type === "text" && <Type className="size-4" />}
                  {overlay.type === "image" && <Image className="size-4" />}
                  {overlay.type === "solid" && <Square className="size-4" />}
                  {overlay.type === "gradient" && <Square className="size-4" />}
                  {overlay.type === "text"
                    ? `Text: ${overlay.text.slice(0, 20)}...`
                    : overlay.type === "image"
                      ? `Image: ${overlay.src.slice(0, 20)}...`
                      : overlay.type}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={e => {
                    e.stopPropagation();
                    removeOverlay(index);
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-0.5">
              {overlay.type === "text" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Text</Label>
                    <Textarea
                      value={overlay.text}
                      onChange={e =>
                        updateOverlay(index, {text: e.target.value})
                      }
                      className="rounded-lg resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Font Size</Label>
                      <Input
                        type="number"
                        value={overlay.fontSize || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            fontSize: parseInt(e.target.value) || undefined,
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Color</Label>
                      <Input
                        placeholder="FF0000"
                        value={overlay.color || ""}
                        onChange={e =>
                          updateOverlay(index, {color: e.target.value})
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">
                      Background Color
                    </Label>
                    <Input
                      placeholder="FFFFFF"
                      value={overlay.backgroundColor || ""}
                      onChange={e =>
                        updateOverlay(index, {backgroundColor: e.target.value})
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Align</Label>
                    <Select
                      value={overlay.align || "center"}
                      onValueChange={value =>
                        updateOverlay(index, {
                          align: value as "left" | "center" | "right",
                        })
                      }
                    >
                      <SelectTrigger className={inputStyles} style={gradientBg}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={overlay.bold || false}
                        onCheckedChange={checked =>
                          updateOverlay(index, {bold: checked})
                        }
                      />
                      <Label className="text-xs">Bold</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={overlay.italic || false}
                        onCheckedChange={checked =>
                          updateOverlay(index, {italic: checked})
                        }
                      />
                      <Label className="text-xs">Italic</Label>
                    </div>
                  </div>
                </>
              )}

              {overlay.type === "image" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Image Source</Label>
                    <Input
                      placeholder="image.jpg or full URL"
                      value={overlay.src}
                      onChange={e =>
                        updateOverlay(index, {src: e.target.value})
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Width</Label>
                      <Input
                        type="number"
                        value={overlay.width || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            width: parseInt(e.target.value) || undefined,
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
                        value={overlay.height || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            height: parseInt(e.target.value) || undefined,
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">X Position</Label>
                      <Input
                        type="number"
                        value={overlay.x || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            x: parseInt(e.target.value) || undefined,
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Y Position</Label>
                      <Input
                        type="number"
                        value={overlay.y || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            y: parseInt(e.target.value) || undefined,
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                </>
              )}

              {overlay.type === "solid" && (
                <>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Color</Label>
                    <Input
                      placeholder="FF0000"
                      value={overlay.color}
                      onChange={e =>
                        updateOverlay(index, {color: e.target.value})
                      }
                      className={inputStyles}
                      style={gradientBg}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Width</Label>
                      <Input
                        type="number"
                        value={overlay.width || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            width: parseInt(e.target.value) || undefined,
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
                        value={overlay.height || ""}
                        onChange={e =>
                          updateOverlay(index, {
                            height: parseInt(e.target.value) || undefined,
                          })
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                </>
              )}

              {overlay.type === "gradient" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">From Color</Label>
                      <Input
                        placeholder="FF0000"
                        value={overlay.fromColor || ""}
                        onChange={e =>
                          updateOverlay(index, {fromColor: e.target.value})
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">To Color</Label>
                      <Input
                        placeholder="0000FF"
                        value={overlay.toColor || ""}
                        onChange={e =>
                          updateOverlay(index, {toColor: e.target.value})
                        }
                        className={inputStyles}
                        style={gradientBg}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Direction</Label>
                    <Select
                      value={overlay.direction?.toString() || "180"}
                      onValueChange={value =>
                        updateOverlay(index, {
                          direction: isNaN(Number(value))
                            ? value
                            : Number(value),
                        })
                      }
                    >
                      <SelectTrigger className={inputStyles} style={gradientBg}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Top (0°)</SelectItem>
                        <SelectItem value="45">Top Right (45°)</SelectItem>
                        <SelectItem value="90">Right (90°)</SelectItem>
                        <SelectItem value="135">Bottom Right (135°)</SelectItem>
                        <SelectItem value="180">Bottom (180°)</SelectItem>
                        <SelectItem value="225">Bottom Left (225°)</SelectItem>
                        <SelectItem value="270">Left (270°)</SelectItem>
                        <SelectItem value="315">Top Left (315°)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {transforms.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <Plus className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No overlays added yet</p>
          <p className="text-xs">Click the buttons above to add overlays</p>
        </div>
      )}

      <Button
        variant="ghost"
        onClick={() => onTransformChange([])}
        className="w-full rounded-full mt-4"
        disabled={transforms.length === 0}
      >
        Clear All Overlays
      </Button>
    </div>
  );
}
