import { useContext } from "react";
import ColorPicker from "../ui/colorPicker";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
import { shadowStyles, ShadowType } from "@/lib/style-mappings";

const shadowOptions: { value: ShadowType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "soft", label: "Soft" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "glow", label: "Glow" },
];

const Buttons = () => {
  const { cardStyle, updateCardStyle, updateStyle, isSaving } =
    useContext(AppContext)!;

  const { button_radius, button_type, shadow } = cardStyle!;
  if (!cardStyle) return;
  return (
    <div className="flex flex-col gap-5 sm:gap-6 w-full">
      <div>
        <h2 className="text-sm sm:text-base font-semibold">Button Style</h2>
        <div className="flex flex-wrap w-full mt-2 gap-2 sm:gap-3">
          <button
            className={`${button_type == "solid" && "ring-2 ring-black/30"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "solid" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm bg-white shadow-(--shadow-card) rounded-full">
              <p>Solid</p>
            </div>
          </button>
          <button
            className={`${button_type == "glass" && "ring-2 ring-black/30"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "glass" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm bg-white/10 backdrop-blur-lg shadow-(--shadow-card) rounded-full">
              <p>Glass</p>
            </div>
          </button>
          <button
            className={`${button_type == "outline" && "ring-2 ring-black/30"} h-16 sm:h-20 flex flex-1 sm:flex-none sm:w-40 items-center justify-center bg-black/5 flex-col gap-1 p-2 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_type: "outline" });
            }}
          >
            <div className="w-full h-9 sm:h-12 flex items-center justify-center font-bold text-xs sm:text-sm ring ring-black/40 shadow-(--shadow-card) rounded-full">
              <p>Outline</p>
            </div>
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-sm sm:text-base font-semibold">Button Corner</h2>
        <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
          <button
            className={`${button_radius == "square" && "ring-2 ring-black/30"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "square" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-white items-center justify-center font-bold text-xs sm:text-sm ring ring-black/40 shadow-(--shadow-card)">
              <p>Square</p>
            </div>
          </button>
          <button
            className={`${button_radius == "round" && "ring-2 ring-black/30"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "round" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-white items-center rounded-md justify-center font-bold text-xs sm:text-sm ring ring-black/40 shadow-(--shadow-card)">
              <p>Round</p>
            </div>
          </button>
          <button
            className={`${button_radius == "rounder" && "ring-2 ring-black/30"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "rounder" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-white items-center rounded-lg justify-center font-bold text-xs sm:text-sm ring ring-black/40 shadow-(--shadow-card)">
              <p>Rounder</p>
            </div>
          </button>
          <button
            className={`${button_radius == "pill" && "ring-2 ring-black/30"} h-16 sm:h-20 flex-1 sm:flex-none sm:w-32 p-2 sm:p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-lg transition-all touch-manipulation`}
            onClick={() => {
              updateCardStyle({ button_radius: "pill" });
            }}
          >
            <div className="w-full h-8 sm:h-10 flex bg-white items-center rounded-full justify-center font-bold text-xs sm:text-sm ring ring-black/40 shadow-(--shadow-card)">
              <p>Pill</p>
            </div>
          </button>
        </div>
      </div>

      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Button background color</p>
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
            const shadowStyle = shadowStyles[option.value];

            return (
              <button
                key={option.value}
                className={`group relative flex flex-col items-center gap-2 p-2 sm:p-3 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                  isActive
                    ? "border-black bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50"
                }`}
                onClick={() => updateCardStyle({ shadow: option.value })}
              >
                {/* Shadow Preview Box */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white transition-transform group-hover:scale-105"
                  style={shadowStyle}
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-neutral-900" : "text-neutral-600"
                  }`}
                >
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button className="w-full sm:w-40 mt-2" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <Spinner /> : "Save changes"}
      </Button>
    </div>
  );
};

export default Buttons;
