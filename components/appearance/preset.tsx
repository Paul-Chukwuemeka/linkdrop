"use client";

import { useStyle } from "@/context/StyleContext";
import { Button } from "@/components/ui/Button";
import { CardTheme } from "@/lib/types";

const STYLE_PRESETS: CardTheme[] = [
  {
    name: "Default",
    card_bg: "ffffff",
    bg_type: "solid",
    text_color: "000000",
    button_radius: "round",
    button_bg: "000000",
    button_color: "ffffff",
    button_type: "solid",
    profile_image: null,
    shadow: "none",
    shadow_color: null,
    font_style: "Inter",
    gradient: [],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: null,
  },
  {
    name: "Midnight",
    card_bg: "0f0f0f",
    bg_type: "solid",
    text_color: "ffffff",
    button_radius: "round",
    button_bg: "ffffff",
    button_color: "0f0f0f",
    button_type: "solid",
    profile_image: null,
    shadow: "medium",
    shadow_color: null,
    font_style: "Inter",
    gradient: [],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: null,
  },
  {
    name: "Sunset",
    card_bg: "ff6b6b",
    bg_type: "gradient",
    text_color: "ffffff",
    button_radius: "round",
    button_bg: "ffffff",
    button_color: "ff6b6b",
    button_type: "solid",
    profile_image: null,
    shadow: "medium",
    shadow_color: null,
    font_style: "Inter",
    gradient: ["ff6b6b", "feca57"],
    title_size: "large",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: "ffffff",
  },
  {
    name: "Ocean",
    card_bg: "0077b6",
    bg_type: "gradient",
    text_color: "ffffff",
    button_radius: "pill",
    button_bg: "00b4d8",
    button_color: "ffffff",
    button_type: "solid",
    profile_image: null,
    shadow: "medium",
    shadow_color: null,
    font_style: "Inter",
    gradient: ["03045e", "0077b6", "00b4d8"],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 180,
    title_color: "caf0f8",
  },
  {
    name: "Forest",
    card_bg: "2d6a4f",
    bg_type: "solid",
    text_color: "d8f3dc",
    button_radius: "square",
    button_bg: "95d5b2",
    button_color: "1b4332",
    button_type: "solid",
    profile_image: null,
    shadow: "soft",
    shadow_color: null,
    font_style: "Inter",
    gradient: [],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: "d8f3dc",
  },
  {
    name: "Rose",
    card_bg: "fff0f3",
    bg_type: "solid",
    text_color: "590d22",
    button_radius: "round",
    button_bg: "ff4d6d",
    button_color: "ffffff",
    button_type: "solid",
    profile_image: null,
    shadow: "soft",
    shadow_color: null,
    font_style: "Inter",
    gradient: [],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: "590d22",
  },
  {
    name: "Slate",
    card_bg: "334155",
    bg_type: "solid",
    text_color: "f1f5f9",
    button_radius: "square",
    button_bg: "475569",
    button_color: "f1f5f9",
    button_type: "outline",
    profile_image: null,
    shadow: "none",
    shadow_color: null,
    font_style: "Inter",
    gradient: [],
    title_size: "medium",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: "ffffff",
  },
  {
    name: "Aurora",
    card_bg: "10002b",
    bg_type: "gradient",
    text_color: "ffffff",
    button_radius: "round",
    button_bg: "e0aaff",
    button_color: "10002b",
    button_type: "solid",
    profile_image: null,
    shadow: "glow",
    shadow_color: "e0aaff",
    font_style: "Inter",
    gradient: ["10002b", "3c096c", "7b2ff7", "e0aaff"],
    title_size: "large",
    text_size: "medium",
    gradient_type: "linear",
    gradient_direction: 135,
    title_color: "e0aaff",
  },
];

function getBackgroundStyle(preset: CardTheme): React.CSSProperties {
  if (preset.bg_type === "gradient" && preset.gradient.length > 0) {
    const gradient = preset.gradient.map((c) => `#${c}`).join(",");
    const angle = preset.gradient_direction ?? 135;
    return {
      background: `linear-gradient(${angle}deg, ${gradient})`,
    };
  }
  return { backgroundColor: `#${preset.card_bg}` };
}

function getButtonStyle(preset: CardTheme): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius:
      preset.button_radius === "pill"
        ? "9999px"
        : preset.button_radius === "round"
        ? "8px"
        : preset.button_radius === "rounder"
        ? "16px"
        : "0px",
  };

  if (preset.button_type === "outline") {
    return {
      ...base,
      border: `2px solid #${preset.button_bg}`,
      background: "transparent",
      color: `#${preset.button_color}`,
    };
  }

  if (preset.button_type === "glass") {
    return {
      ...base,
      background: "rgba(255,255,255,0.3)",
      backdropFilter: "blur(5px)",
      color: `#${preset.button_color}`,
    };
  }

  return {
    ...base,
    backgroundColor: `#${preset.button_bg}`,
    color: `#${preset.button_color}`,
  };
}

const Presets = () => {
  const { cardStyle, updateCardStyle, updateStyle, isSavingStyle: isSaving } =
    useStyle();

  const handleApplyPreset = (preset: CardTheme) => {
    updateCardStyle({
      card_bg: preset.card_bg,
      bg_type: preset.bg_type,
      text_color: preset.text_color,
      button_radius: preset.button_radius,
      button_bg: preset.button_bg,
      button_color: preset.button_color,
      button_type: preset.button_type,
      profile_image: preset.profile_image,
      shadow: preset.shadow,
      font_style: preset.font_style,
      gradient: preset.gradient,
      title_size: preset.title_size,
      text_size: preset.text_size,
      gradient_type: preset.gradient_type,
      gradient_direction: preset.gradient_direction,
      title_color: preset.title_color,
      name: preset.name
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-180">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Theme Presets
        </h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Choose a preset to quickly apply a complete theme to your profile.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {STYLE_PRESETS.map((preset, i) => {
            const isActive = cardStyle?.name === preset.name;
            const bgStyle = getBackgroundStyle(preset);
            const btnStyle = getButtonStyle(preset);

            return (
              <button
                key={i}
                onClick={() => handleApplyPreset(preset)}
                className={`group relative flex flex-col gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
                  isActive
                    ? "border-black dark:border-white shadow-md"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                }`}
              >
                <div
                  className={` w-full aspect-4/3 rounded-lg shadow-inner overflow-hidden relative`}
                  style={bgStyle}
                >
                  {/* Mock Profile Preview */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                    <div
                      className="w-8 h-8 rounded-full border-2"
                      style={{ borderColor: `#${preset.text_color}` }}
                    />
                    <div
                      className="w-16 h-2 rounded"
                      style={{ backgroundColor: `#${preset.text_color}` }}
                    />
                    <div
                      className="w-12 h-1.5 rounded opacity-60"
                      style={{ backgroundColor: `#${preset.text_color}` }}
                    />
                    {/* Mock Button */}
                    <div
                      className="mt-2 w-20 h-6 text-[8px] font-semibold flex items-center justify-center"
                      style={btnStyle}
                    >
                      Button
                    </div>
                  </div>
                </div>

                {/* Preset Name */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-sm ${
                      isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {preset.name}
                  </span>
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-black dark:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="w-40"
          onClick={updateStyle}
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};

export default Presets;
