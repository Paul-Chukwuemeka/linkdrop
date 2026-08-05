"use client";

import ColorPicker from "../ui/colorPicker";
import { isLight, lighten, darken } from "@/utils/colors";
import { CiImageOn } from "react-icons/ci";
import { useMemo, useState, useEffect } from "react";
import { useStyle } from "@/context/StyleContext";
import { useCard } from "@/context/CardContext";
import { apiFetch, ApiError } from "@/lib/api";
import { Button } from "../ui/Button";
import { ButtonLoader } from "../ui/ButtonLoader";
import { GradientColorsManager } from "./GradientColorPicker";
import toast from "react-hot-toast";

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
  const { cardStyle, updateStyle, isSavingStyle: isSaving, updateCardStyle } =
    useStyle();
  const { currentCard } = useCard();
  const { bg_type, gradient_type, gradient_direction, gradient, card_bg } =
    cardStyle ?? {};
  const [imageUrl, setImageUrl] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [isPublishingBg, setIsPublishingBg] = useState(false);

  useEffect(() => {
    if (!pendingFile) {
      setPendingPreview(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPendingPreview(url);
    updateCardStyle({ bg_type: "image", profile_image: url });
    return () => URL.revokeObjectURL(url);
  }, [pendingFile, updateCardStyle]);

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setPendingFile(file);
  }

  async function uploadPendingImage(): Promise<string | null> {
    if (!pendingFile || !currentCard) return null;
    setIsPublishingBg(true);
    try {
      const formData = new FormData();
      formData.append("file", pendingFile);
      const res = await apiFetch<{ url: string }>(
        `/api/cards/${currentCard.id}/background`,
        { method: "POST", body: formData },
      );
      setPendingFile(null);
      return res.url;
    } catch (err) {
      toast.error(
        err instanceof ApiError ? err.message : "Failed to upload image",
      );
      return null;
    } finally {
      setIsPublishingBg(false);
    }
  }

  async function handleSave() {
    const url = await uploadPendingImage();
    if (url) updateCardStyle({ bg_type: "image", profile_image: url });
    await updateStyle();
  }

  function handleApplyUrl() {
    const value = imageUrl.trim();
    if (!value) return;
    try {
      const u = new URL(value);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
    } catch {
      toast.error("Enter a valid http(s) URL");
      return;
    }
    updateCardStyle({ bg_type: "image", profile_image: value });
    toast.success("Background image set");
    setImageUrl("");
  }

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
  }, [gradient_type, gradient_direction, gradientColors]);

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
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 dark:text-white/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "solid" ? "ring-2 ring-black/50 dark:ring-white/50" : "ring-1 ring-black/20 dark:ring-white/20"}`}
            onClick={() => updateCardStyle({ bg_type: "solid" })}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0"
              style={{ backgroundColor: `#${backgroundColor}` }}
            />
            <p>Solid</p>
          </button>
          <button
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 dark:text-white/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "gradient" ? "ring-2 ring-black/50 dark:ring-white/50" : "ring-1 ring-black/20 dark:ring-white/20"}`}
            onClick={() => updateCardStyle({ bg_type: "gradient" })}
          >
            <div
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0"
              style={gradientStyle}
            />
            <p>Gradient</p>
          </button>
          <button
            className={`flex flex-col items-center gap-1 sm:gap-2 font-semibold text-black/60 dark:text-white/60 text-sm sm:text-base p-2 sm:p-3 rounded-lg transition-all touch-manipulation ${bg_type == "image" ? "ring-2 ring-black/50 dark:ring-white/50" : "ring-1 ring-black/20 dark:ring-white/20"}`}
            onClick={() => updateCardStyle({ bg_type: "image" })}
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-md shrink-0 flex items-center justify-center bg-black/5 dark:bg-white/10">
              <CiImageOn className="text-2xl sm:text-4xl" />
            </div>
            <p>Image</p>
          </button>
        </div>
      </div>

      {/* Gradient Type & Direction - only show when gradient is selected */}
      {bg_type === "gradient" && (
        <div className="flex flex-col gap-4 sm:gap-5 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          {/* Gradient Colors */}
          <div>
            <h2 className="text-sm sm:text-base font-semibold mb-2 sm:mb-3">Gradient Colors</h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-2 sm:mb-3">
              Add up to 6 colors. First color is from Background Color above.
            </p>
            <GradientColorsManager
              colors={gradientColors}
              onChange={handleGradientColorsChange}
              baseColor={backgroundColor}
            />
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 sm:pt-4">
            <h2 className="text-sm sm:text-base font-semibold">Gradient Type</h2>
            <div className="flex gap-2 sm:gap-3 mt-2">
              <button
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-sm font-medium transition-all touch-manipulation ${
                  gradient_type === "linear"
                    ? "border-black dark:border-white bg-white dark:bg-neutral-800"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                }`}
                onClick={() => updateCardStyle({ gradient_type: "linear" })}
              >
                Linear
              </button>
              <button
                className={`flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border-2 text-sm font-medium transition-all touch-manipulation ${
                  gradient_type === "radial"
                    ? "border-black dark:border-white bg-white dark:bg-neutral-800"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
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
                          ? "border-black dark:border-white bg-white dark:bg-neutral-800"
                          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white/50 dark:bg-neutral-800/50"
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
                  <span className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Custom Angle</span>
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
                  className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Background Image - only show when image is selected */}
      {bg_type === "image" && (
        <div className="flex flex-col gap-4 p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <div>
            <h2 className="text-sm sm:text-base font-semibold mb-2">Background Image</h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mb-3">
              Upload an image or paste an image URL. It applies to this card only.
            </p>

            {pendingPreview && (
              <div className="mb-4">
                <div
                  className="aspect-video w-full rounded-lg ring-2 ring-(--accent) bg-cover bg-center"
                  style={{ backgroundImage: `url(${pendingPreview})` }}
                />
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  New image selected — uploads when you click Save changes.
                </p>
              </div>
            )}
            {!pendingPreview && cardStyle?.profile_image && (
              <div
                className="mb-4 aspect-video w-full rounded-lg  ring-black/10 bg-cover bg-center"
                style={{ backgroundImage: `url(${cardStyle.profile_image})` }}
              />
            )}

            <div className="flex flex-col gap-3">
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={isPublishingBg}
                />
                <span className="flex items-center justify-center w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600 px-4 py-3 text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {pendingFile ? "Change image" : "Upload image"}
                </span>
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Paste image URL"
                  className="flex-1 rounded-lg bg-white dark:bg-neutral-900 px-3 py-2 text-sm outline-none  ring-neutral-200 dark:ring-neutral-700 focus:ring-(--accent)"
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  disabled={!imageUrl.trim()}
                  className="rounded-lg bg-black dark:bg-white dark:text-black px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  Apply
                </button>
              </div>

              {(pendingPreview || cardStyle?.profile_image) && (
                <button
                  type="button"
                  onClick={() => {
                    setPendingFile(null);
                    updateCardStyle({ profile_image: null });
                  }}
                  className="self-start text-sm font-semibold text-red-600 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <Button
        className="w-full sm:w-40 mt-2"
        onClick={handleSave}
        disabled={isSaving || isPublishingBg}
      >
        {isSaving ? (
          <ButtonLoader label="Saving…" onDark />
        ) : isPublishingBg ? (
          <ButtonLoader label="Uploading…" onDark />
        ) : (
          "Save changes"
        )}
      </Button>
    </div>
  );
};

export default Background;
