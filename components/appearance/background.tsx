"use client";

import ColorPicker from "../ui/colorPicker";
import { isLight, lighten, darken } from "@/utils/colors";
import { CiImageOn } from "react-icons/ci";
import { useContext, useMemo } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { GradientColorsManager } from "./GradientColorPicker";

// Direction presets with icons
const directionPresets = [
  { angle: 0, label: "→", name: "Right" },
  { angle: 45, label: "↘", name: "Diagonal" },
  { angle: 90, label: "↓", name: "Bottom" },
  { angle: 135, label: "↙", name: "Diagonal" },
  { angle: 180, label: "←", name: "Left" },
  { angle: 225, label: "↖", name: "Diagonal" },
  { angle: 270, label: "↑", name: "Top" },
  { angle: 315, label: "↗", name: "Diagonal" },
];

const Background = () => {
  const { cardStyle, updateStyle, isSaving, updateCardStyle } =
    useContext(AppContext)!;
  const { bg_type, gradient_type, gradient_direction, gradient, card_bg } =
    cardStyle!;

  const backgroundColor = card_bg ?? "ffffff";
  const endColor = useMemo(
    () =>
      isLight(backgroundColor)
        ? darken(backgroundColor, 0.8)
        : lighten(backgroundColor, 0.7),
    [backgroundColor],
  );

  const gradientColors = useMemo(() => {
    return gradient && gradient.length >= 2
      ? gradient
      : [backgroundColor, endColor];
  }, [backgroundColor, endColor, gradient]);

  const gradientPreviewStyle = useMemo(() => {
    const angle = gradient_direction ?? 135;
    const colors = gradientColors.map((c) => `#${c}`).join(", ");

    if (gradient_type === "radial") {
      return {
        background: `radial-gradient(circle, ${colors})`,
      };
    }
    return {
      background: `linear-gradient(${angle}deg, ${colors})`,
    };
  }, [bg_type, gradient_direction, gradientColors]);

  const gradientStyle = gradientPreviewStyle;

  const handleGradientColorsChange = (newColors: string[]) => {
    updateCardStyle({ gradient: newColors });
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-5 w-full">
      <div className="font-semibold flex flex-col mt-1 gap-2">
        <h2 className="text-sm sm:text-base font-semibold">Background Color</h2>
        <div className="w-full sm:w-70">
          <ColorPicker property="card_bg" />
        </div>
      </div>
      <div>
        <h2 className="text-sm sm:text-base font-semibold">Background Style</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "solid" ? "ring-2 ring-black/50" : "ring-1 ring-black/20"}`}
            onClick={() => updateCardStyle({ bg_type: "solid" })}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0"
              style={{ backgroundColor: `#${backgroundColor}` }}
            />
            <p>Solid</p>
          </button>
          <button
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "gradient" ? "ring-2 ring-black/50" : "ring-1 ring-black/20"}`}
            onClick={() => updateCardStyle({ bg_type: "gradient" })}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0"
              style={gradientStyle}
            />
            <p>Gradient</p>
          </button>
          <button
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "image" ? "ring-2 ring-black/50" : "ring-1 ring-black/20"}`}
            onClick={() => updateCardStyle({ bg_type: "image" })}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0 flex items-center justify-center bg-black/5">
              <CiImageOn className="text-2xl sm:text-4xl" />
            </div>
            <p>Image</p>
          </button>
        </div>
      </div>

      {/* Gradient Type & Direction - only show when gradient is selected */}
      {bg_type === "gradient" && (
        <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          {/* Gradient Colors */}
          <div>
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Gradient Colors</h2>
            <p className="text-xs sm:text-sm text-neutral-600 mb-2 sm:mb-3">
              Add up to 6 colors. First color is from Background Color above.
            </p>
            <GradientColorsManager
              colors={gradientColors}
              onChange={handleGradientColorsChange}
              baseColor={backgroundColor}
            />
          </div>

          <div className="border-t border-neutral-200 pt-3 sm:pt-4">
            <h2 className="text-sm sm:text-base font-semibold">Gradient Type</h2>
            <div className="flex gap-2 sm:gap-3 mt-2">
              <button
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-sm font-medium transition-all touch-manipulation ${
                  gradient_type === "linear"
                    ? "border-black bg-white"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
                onClick={() => updateCardStyle({ gradient_type: "linear" })}
              >
                Linear
              </button>
              <button
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-sm font-medium transition-all touch-manipulation ${
                  gradient_type === "radial"
                    ? "border-black bg-white"
                    : "border-neutral-200 hover:border-neutral-300"
                }`}
                onClick={() => updateCardStyle({ gradient_type: "radial" })}
              >
                Radial
              </button>
            </div>
          </div>

          {/* Direction selector - only for linear gradients */}
          {gradient_type === "linear" && (
            <>
              <h2 className="text-sm sm:text-base font-semibold mt-2">Gradient Direction</h2>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {directionPresets.map((preset) => {
                  const isActive = (gradient_direction ?? 135) === preset.angle;
                  return (
                    <button
                      key={preset.angle}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all touch-manipulation ${
                        isActive
                          ? "border-black bg-white"
                          : "border-neutral-200 hover:border-neutral-300 bg-white/50"
                      }`}
                      onClick={() =>
                        updateCardStyle({ gradient_direction: preset.angle })
                      }
                    >
                      <span className="text-base sm:text-lg font-bold">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
              {/* Custom angle slider */}
              <div className="mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs sm:text-sm text-neutral-600">Custom Angle</span>
                  <span className="text-xs sm:text-sm font-medium">
                    {gradient_direction ?? 135}°
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={gradient_direction ?? 135}
                  onChange={(e) =>
                    updateCardStyle({
                      gradient_direction: parseInt(e.target.value),
                    })
                  }
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                />
              </div>
            </>
          )}
        </div>
      )}

      <Button className="w-full sm:w-40 mt-2" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <Spinner /> : "Save changes"}
      </Button>
    </div>
  );
};

export default Background;
