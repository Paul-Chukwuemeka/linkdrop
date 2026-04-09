import { useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { fonts } from "@/lib/fonts";
import { FontType } from "@/lib/types";
import { AppContext } from "@/context/AppContext";

const Fontpicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cardStyle, setCardStyle } = useContext(AppContext)!;

  const currentFont: FontType =
    fonts.find(
      (f) => f.name.toLowerCase() == cardStyle?.font_style.toLowerCase(),
    ) ?? fonts[0];

  return (
    <div
      className="ring ring-black/20 text-black/70 px-4 text-lg w-70 h-12 p-2 flex items-center justify-between rounded-md"
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <p className={`${currentFont.font.className}`}>{currentFont.name}</p>
      <FaChevronDown className="text-md" />

      {isOpen && (
        <div
          className="absolute left-0 p-10 flex items-center justify-center top-0 w-full h-dvh bg-black/10"
          onClick={() => setIsOpen(false)}
        >
          <div className="w-full gap-3 max-w-150 p-5 h-fit grid grid-cols-2 bg-white rounded-xl shadow-(--shadow-card)">
            <div className="col-span-2">
              <p>Page Font</p>
            </div>
            {fonts.map((font, i) => {
              return (
                <button
                  key={i}
                  className={` h-15 ring-1 ${font.font.className} rounded-md ring-black/50`}
                  onClick={() => {
                    if (!cardStyle) return;
                    setCardStyle({ ...cardStyle, font_style: font.name });
                  }}
                >
                  {font.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fontpicker;
