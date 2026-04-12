"use client";

import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { isLight, lighten, darken } from "@/utils/colors";

interface GradientColorPickerProps {
  color: string;
  index: number;
  onChange: (index: number, color: string) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const GradientColorPicker = ({
  color,
  index,
  onChange,
  onRemove,
  canRemove,
}: GradientColorPickerProps) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value.replace("#", "");
    onChange(index, newColor);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative group">
        <input
          type="color"
          value={`#${color}`}
          onChange={handleColorChange}

          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div
          className="w-12 h-12 rounded-lg border-2 border-neutral-200 cursor-pointer transition-transform group-hover:scale-105 shadow-sm"
          style={{ backgroundColor: `#${color}` }}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-neutral-600 uppercase">
          #{color}
        </span>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export interface GradientColorsManagerProps {
  colors: string[];
  onChange: (colors: string[]) => void;
  baseColor: string;
}

export const GradientColorsManager = ({
  colors,
  onChange,
  baseColor,
}: GradientColorsManagerProps) => {

  // Generate colors for the palette based on base color
  const generatePalette = (base: string): string[] => {
    const isBaseLight = isLight(base);
    return [
      base,
      isBaseLight ? darken(base, 0.2) : lighten(base, 0.2),
      isBaseLight ? darken(base, 0.4) : lighten(base, 0.4),
      isBaseLight ? darken(base, 0.6) : lighten(base, 0.6),
    ];
  };

  const paletteColors = generatePalette(baseColor);

  const handleColorChange = (index: number, newColor: string) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    onChange(newColors);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length > 2) {
      const newColors = colors.filter((_, i) => i !== index);
      onChange(newColors);
    }
  };

  const handleAddColor = (newColor: string) => {
    if (colors.length < 6) {
      onChange([...colors, newColor.replace("#", "")]);
    }
  };

  const handleAddFromPalette = (color: string) => {
    if (colors.length < 6) {
      onChange([...colors, color]);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Current gradient colors */}
      <div className="flex flex-wrap items-center gap-3">
        {colors.map((color, index) => (
          <GradientColorPicker
            key={`${index}-${color}`}
            color={color}
            index={index}
            onChange={handleColorChange}
            onRemove={handleRemoveColor}
            canRemove={colors.length > 2}
          />
        ))}
        {colors.length < 6 && (
          <div className="relative group">
            <input
              type="color"
              value="#808080"
              onChange={(e) => handleAddColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
            <button className="w-12 h-12 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 hover:border-black hover:text-black transition-all pointer-events-none">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-neutral-500">Quick add from palette:</span>
        <div className="flex gap-2">
          {paletteColors.map((color, index) => (
            <button
              key={index}
              onClick={() => handleAddFromPalette(color)}
              disabled={colors.length >= 6}
              className="w-8 h-8 rounded-md border border-neutral-200 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: `#${color}` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientColorPicker;
