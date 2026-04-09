import ColorPicker from "../ui/colorPicker";
import Fontpicker from "../ui/Fontpicker";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";
const Text = () => {
  const { cardStyle, setCardStyle,updateStyle,isSaving } = useContext(AppContext)!;

  const { title_size, text_size } = cardStyle!;

  if (!cardStyle) return;

  const titleSizes = ["small", "medium", "large"] as const;
  const textSizes = ["small", "medium", "large"] as const;

  return (
    <div className="flex flex-col gap-3">
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-md">Page font</p>
        <Fontpicker />
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-md">Page text color</p>
        <ColorPicker property="text_color" />
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-md">Title color</p>
        <ColorPicker property="title_color" />
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-md">Title size</p>
        <div className="flex gap-2">
          {titleSizes.map((t, i) => {
            return (
              <button
                key={i}
                className={` ${title_size == t ? "ring-2 bg-black/5 ring-black/30 " : "ring-1 ring-black/30 "} text-md rounded-md shrink-0 w-25 h-11`}
                onClick={() => {
                  setCardStyle({ ...cardStyle, title_size: t });
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
      <div className="font-semibold flex flex-col gap-2">
        <p className="text-md">Text size</p>
        <div className="flex gap-2">
          {textSizes.map((t, i) => {
            return (
              <button
                key={i}
                className={` ${text_size == t ? "ring-2 bg-black/5 ring-black/30 " : "ring-1 ring-black/30 "} text-md rounded-md shrink-0 w-25 h-11`}
                onClick={() => {
                  setCardStyle({ ...cardStyle, text_size: t });
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>
        <Button className="w-40 mt-3" onClick={updateStyle} disabled={isSaving}>
          {isSaving ? <Spinner/> : "Save changes"}
        </Button>
    </div>
  );
};

export default Text;
