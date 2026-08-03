import ColorPicker from "../ui/colorPicker";
import Fontpicker from "../ui/Fontpicker";
import { useStyle } from "@/context/StyleContext";
import { Button } from "../ui/Button";
import { ButtonLoader } from "../ui/ButtonLoader";
const Text = () => {
  const { cardStyle, updateCardStyle,updateStyle,isSavingStyle: isSaving } = useStyle();

  if (!cardStyle) return null;

  const { title_size, text_size } = cardStyle;

  const titleSizes = ["small", "medium", "large"] as const;
  const textSizes = ["small", "medium", "large"] as const;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Page font</p>
        <div className="w-full sm:w-70">
          <Fontpicker />
        </div>
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Page text color</p>
        <div className="w-full sm:w-70">
          <ColorPicker property="text_color" />
        </div>
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Title color</p>
        <div className="w-full sm:w-70">
          <ColorPicker property="title_color" />
        </div>
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Title size</p>
        <div className="flex flex-wrap gap-2">
          {titleSizes.map((t, i) => {
            return (
              <button
                key={i}
                className={`${title_size == t ? "ring-2 bg-black/5 dark:bg-white/10 ring-black/30 dark:ring-white/30" : "ring-1 ring-black/30 dark:ring-white/30"} text-sm sm:text-base rounded-lg shrink-0 px-4 sm:px-6 h-10 sm:h-11 capitalize transition-all`}
                onClick={() => {
                  updateCardStyle({ title_size: t });
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-sm sm:text-base">Text size</p>
        <div className="flex flex-wrap gap-2">
          {textSizes.map((t, i) => {
            return (
              <button
                key={i}
                className={`${text_size == t ? "ring-2 bg-black/5 dark:bg-white/10 ring-black/30 dark:ring-white/30" : "ring-1 ring-black/30 dark:ring-white/30"} text-sm sm:text-base rounded-lg shrink-0 px-4 sm:px-6 h-10 sm:h-11 capitalize transition-all`}
                onClick={() => {
                  updateCardStyle({ text_size: t });
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <Button className="w-full sm:w-40 mt-2" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <ButtonLoader label="Saving…" onDark /> : "Save changes"}
      </Button>
    </div>
  );
};

export default Text;
