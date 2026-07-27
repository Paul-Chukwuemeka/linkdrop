import { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fonts } from "@/lib/fonts";
import { FontType } from "@/lib/types";
import { useStyle } from "@/context/StyleContext";

const Fontpicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cardStyle, updateCardStyle } = useStyle();

  const currentFont: FontType =
    fonts.find(
      (f) => f.name.toLowerCase() == cardStyle?.font_style?.toLowerCase(),
    ) ?? fonts[0];

  return (
    <div className="relative">
      <button
        className="w-full ring ring-black/20 dark:ring-white/20 text-black/70 dark:text-white/70 px-3 sm:px-4 text-base sm:text-lg h-10 sm:h-12 p-2 flex items-center justify-between rounded-lg bg-white dark:bg-neutral-900 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        aria-label="Select font"
      >
        <span className={`${currentFont.font.className} truncate`}>{currentFont.name}</span>
        <FaChevronDown className={`text-sm transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-xl shadow-(--shadow-card) max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 dark:text-white">Select Font</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {fonts.map((font, i) => {
                const isSelected = currentFont.name === font.name;
                return (
                  <button
                    key={i}
                    className={`h-12 sm:h-14 px-4 ring-1 rounded-lg transition-all touch-manipulation ${font.font.className} ${
                      isSelected
                        ? "ring-2 ring-black dark:ring-white bg-black/5 dark:bg-white/10"
                        : "ring-black/20 dark:ring-white/20 hover:ring-black/40 dark:hover:ring-white/40"
                    }`}
                    onClick={() => {
                      if (!cardStyle) return;
                      updateCardStyle({ font_style: font.name });
                      setIsOpen(false);
                    }}
                  >
                    {font.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fontpicker;
