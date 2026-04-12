import { AppContext } from "@/context/AppContext";
import { CardTheme } from "@/lib/types";
import { useContext, useState } from "react";

const ColorPicker = ({ property }: { property: keyof CardTheme }) => {
  const { cardStyle, updateCardStyle } = useContext(AppContext)!;
  const [isOpen, setIsOpen] = useState(false);

  const value =
    cardStyle && cardStyle[property] !== null ? cardStyle[property] : "ffffff";

  return (
    <div
      className="ring ring-black/20 text-black/70 px-4 text-lg w-70 h-12 p-2 flex items-center justify-between rounded-md"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      #
      <input
        type="text"
        onInput={(e) => {
          if (!cardStyle) return;
          updateCardStyle({ [property]: e.currentTarget.value });
        }}
        value={value}
        className="w-full outline-none"
      />
      <div className="w-7 ring-1 ring-black/30 h-7 shrink-0 flex overflow-hidden rounded-full justify-center items-center">
        <input
          type="color"
          value={`#${value}`}
          className="cursor-pointer w-12 shrink-0 h-12 rounded-full"
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
