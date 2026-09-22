import { useStyle } from "@/context/StyleContext";
import { CardTheme } from "@/lib/types";

const ColorPicker = ({ property }: { property: keyof CardTheme }) => {
  const { cardStyle, updateCardStyle } = useStyle();

  const value =
    cardStyle && cardStyle[property] != null ? String(cardStyle[property]) : "ffffff";

  return (
    <div
      className="w-full ring ring-black/20 dark:ring-white/20 text-black/70 dark:text-white/70 px-3 sm:px-4 text-base sm:text-lg h-10 sm:h-12 p-2 flex items-center justify-between rounded-lg bg-white dark:bg-neutral-900"
    >
      <span className="text-gray-400 dark:text-gray-500">#</span>
      <label htmlFor={`color-${property}`} className="sr-only">Color value</label>
      <input
        id={`color-${property}`}
        type="text"
        onChange={(e) => {
          if (!cardStyle) return;
          updateCardStyle({ [property]: e.currentTarget.value });
        }}
        value={value}
        className="w-full outline-none bg-transparent ml-1 text-sm sm:text-base dark:text-neutral-100"
        maxLength={6}
        autoComplete="off"
      />
      <div className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 flex border-2 border-gray-300 overflow-hidden rounded-full justify-center items-center  ring-black/30 dark:ring-white/30 ml-2">
        <label htmlFor={`color-picker-${property}`} className="sr-only">Pick color</label>
        <input
          id={`color-picker-${property}`}
          type="color"
          value={`#${value}`}
          className="cursor-pointer border-0 w-10 h-10 sm:w-12 sm:h-12 shrink-0 p-0 "
          onChange={(e) => {
            if (!cardStyle) return;
            updateCardStyle({
              [property]: e.currentTarget.value.slice(1),
            });
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
