import ColorPicker from "../ui/colorPicker";
import { useStyle } from "@/context/StyleContext";
import { Button } from "../ui/Button";
import { ButtonLoader } from "../ui/ButtonLoader";
import { getShadowStyles, ShadowType } from "@/lib/style-mappings";

const shadowOptions: { value: ShadowType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "glow", label: "Glow" },
];

const glassOptions: { value: "glass-light" | "glass" | "glass-heavy"; label: string; preview: string }[] = [
  { value: "glass-light", label: "Light", preview: "bg-white/15" },
  { value: "glass", label: "Medium", preview: "bg-white/30" },
  { value: "glass-heavy", label: "Heavy", preview: "bg-white/50" },
];

const Buttons = () => {
  const { cardStyle, updateCardStyle, updateStyle, isSavingStyle: isSaving } =
    useStyle();

  if (!cardStyle) return;
  const { button_radius, button_type, shadow } = cardStyle;
  const isGlass = button_type.startsWith("glass");
  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full">
      <div>
        <h2 className="text-sm sm:text-base font-semibold">Button Style</h2>
        <div className="flex flex-wrap w-full mt-2 gap-2 sm:gap-3">
          <button
            className={`${button_type == "solid" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "solid" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-(--shadow-card) rounded-full">
              <p>Solid</p>
            </div>
          </button>
          <button
            className={`${isGlass && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "glass" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm bg-white/30 backdrop-blur-lg text-neutral-900 dark:text-neutral-100 shadow-(--shadow-card) rounded-full">
              <p>Glass</p>
            </div>
          </button>
          <button
            className={`${button_type == "outline" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "outline" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm ring-2 ring-black dark:ring-white/60 shadow-(--shadow-card) rounded-full">
              <p>Outline</p>
            </div>
          </button>
        </div>
      </div>

      {isGlass && (
        <div>
          <h2 className="text-sm sm:text-base font-semibold">Glass Intensity</h2>
          <div className="flex flex-wrap w-full mt-2 gap-2 sm:gap-3">
            {glassOptions.map((option) => (
              <button
                key={option.value}
                className={`${button_type == option.value && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-32 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
                onClick={() => {
                  updateCardStyle({ button_type: option.value });
                }}
              >
                <div
                  className={`w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm ${option.preview} backdrop-blur-lg text-neutral-900 dark:text-neutral-100 shadow-(--shadow-card) rounded-full`}
                >
                  <p>{option.label}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-sm sm:text-base font-semibold">Button Corner</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
          <button
            className={`${button_radius == "square" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "square" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-neutral-100 dark:bg-neutral-700 items-center justify-center font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 ring-2 ring-black dark:ring-white/60 shadow-(--shadow-card)">
              <p>Square</p>
            </div>
          </button>
          <button
            className={`${button_radius == "round" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "round" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-neutral-100 dark:bg-neutral-700 items-center rounded-md justify-center font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 ring-2 ring-black dark:ring-white/60 shadow-(--shadow-card)">
              <p>Round</p>
            </div>
          </button>
          <button
            className={`${button_radius == "rounder" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "rounder" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-neutral-100 dark:bg-neutral-700 items-center rounded-lg justify-center font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 ring-2 ring-black dark:ring-white/60 shadow-(--shadow-card)">
              <p>Rounder</p>
            </div>
          </button>
          <button
            className={`${button_radius == "pill" && "ring-2 ring-black dark:ring-white/40"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "pill" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-neutral-100 dark:bg-neutral-700 items-center rounded-full justify-center font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 ring-2 ring-black dark:ring-white/60 shadow-(--shadow-card)">
              <p>Pill</p>
            </div>
          </button>
        </div>
      </div>

      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Button {button_type === "outline" ? "outline" : "background"} color</p>
        <div className="w-full sm:w-70">
          <ColorPicker property="button_bg" />
        </div>
      </div>

      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Button text color</p>
        <div className="w-full sm:w-70">
          <ColorPicker property="button_color" />
        </div>
      </div>

      {/* Shadow Style Section */}
      <div>
        <h2 className="text-sm sm:text-base font-semibold mb-3">Shadow Style</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
          {shadowOptions.map((option) => {
            const isActive = shadow === option.value;
            const styles = getShadowStyles(cardStyle.shadow_color);
            const shadowStyle = styles[option.value];

            return (
              <button
                key={option.value}
                className={`group relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                  isActive
                    ? "border-black dark:border-white bg-neutral-50 dark:bg-neutral-800"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50"
                }`}
                onClick={() => updateCardStyle({ shadow: option.value })}
              >
                {/* Shadow Preview Box */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white dark:bg-neutral-700 transition-transform group-hover:scale-105"
                  style={shadowStyle}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-600 dark:text-neutral-400"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Shadow color</p>
        <div className="w-full sm:w-70">
          <ColorPicker property="shadow_color" />
        </div>
      </div>

      <Button className="w-full sm:w-40 mt-2" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Save changes"}
      </Button>
    </div>
  );
};

export default Buttons;
