import { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fonts } from "@/lib/fonts";
import { FontType } from "@/lib/types";
import { AppContext } from "@/context/AppContext";

const Fontpicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cardStyle, updateCardStyle } = useContext(AppContext)!;

  const currentFont: FontType =
    fonts.find(
      (f) => f.name.toLowerCase() == cardStyle?.font_style.toLowerCase(),
    ) ?? fonts[0];

  return (
    <div className="relative">
      <button
        className="w-full ring ring-black/20 text-black/70 px-3 sm:px-4 text-base sm:text-lg h-10 sm:h-12 p-2 flex items-center justify-between rounded-lg bg-white transition-colors hover:bg-gray-50"
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
            className="w-full max-w-md sm:max-w-lg p-4 sm:p-6 bg-white rounded-xl shadow-(--shadow-card) max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Select Font</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {fonts.map((font, i) => {
                const isSelected = currentFont.name === font.name;
                return (
                  <button
                    key={i}
                    className={`h-12 sm:h-14 px-4 ring-1 rounded-lg transition-all touch-manipulation ${font.font.className} ${
                      isSelected
                        ? "ring-2 ring-black bg-black/5"
                        : "ring-black/20 hover:ring-black/40"
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
