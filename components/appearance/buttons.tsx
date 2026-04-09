import { useContext } from "react";
import ColorPicker from "../ui/colorPicker";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

const Buttons = () => {
  const { cardStyle, setCardStyle, updateStyle, isSaving } =
    useContext(AppContext)!;

  const { button_radius, button_type } = cardStyle!;
  if (!cardStyle) return;
  return (
    <div className="flex flex-col gap-2 w-full max-w-180">
      <div>
        <h2 className="text-md font-semibold">Button Style</h2>
        <div className="flex flex-wrap w-full mt-2 gap-2">
          <button
            className={`${button_type == "solid" && "ring-2 ring-black/30"} h-20 flex w-50 items-center justify-center bg-black/5 flex-col gap-1 p-1 rounded-md`}
            onClick={() => {
              setCardStyle({ ...cardStyle, button_type: "solid" });
            }}
          >
            <div className="w-full h-12 flex items-center justify-center font-bold text-sm bg-white shadow-(--shadow-card) rounded-full">
              <p>Solid</p>
            </div>
          </button>
          <button
            className={`${button_type == "glass" && "ring-2 ring-black/30"} h-20 flex w-50 items-center justify-center bg-black/5 flex-col gap-1 p-1 rounded-md`}
            onClick={() => {
              setCardStyle({ ...cardStyle, button_type: "glass" });
            }}
          >
            <div className="w-full h-12 flex items-center justify-center font-bold text-sm bg-white/10 backdrop-blur-lg shadow-(--shadow-card) rounded-full">
              <p>Glass</p>
            </div>
          </button>
          <button
            className={`${button_type == "outline" && "ring-2 ring-black/30"} h-20 flex w-50 items-center justify-center bg-black/5 flex-col gap-1 p-1 rounded-md`}
            onClick={() => {
              setCardStyle({ ...cardStyle, button_type: "outline" });
            }}
          >
            <div className="w-full h-12 flex items-center justify-center font-bold text-sm ring ring-black/40 shadow-(--shadow-card) rounded-full">
              <p>Outline</p>
            </div>
          </button>
        </div>
      </div>
      <h2 className="text-md font-semibold">Button Corner</h2>
      <div className="flex flex-wrap gap-2">
        <button
          className={`${button_radius == "square" && "ring-2 ring-black/30"} h-20 w-40 p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-md`}
          onClick={() => {
            setCardStyle({ ...cardStyle, button_radius: "square" });
          }}
        >
          <div className="w-full h-10 flex bg-white items-center justify-center font-bold text-sm ring ring-black/40 shadow-(--shadow-card)">
            <p>Square</p>
          </div>
        </button>
        <button
          className={`${button_radius == "round" && "ring-2 ring-black/30"} h-20 w-40 p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-md`}
          onClick={() => {
            setCardStyle({ ...cardStyle, button_radius: "round" });
          }}
        >
          <div className="w-full h-10 flex bg-white items-center rounded-md justify-center font-bold text-sm ring ring-black/40 shadow-(--shadow-card)">
            <p>round</p>
          </div>
        </button>
        <button
          className={`${button_radius == "rounder" && "ring-2 ring-black/30"} h-20 w-40 p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-md`}
          onClick={() => {
            setCardStyle({ ...cardStyle, button_radius: "rounder" });
          }}
        >
          <div className="w-full h-10 flex bg-white items-center rounded-lg justify-center font-bold text-sm ring ring-black/40 shadow-(--shadow-card)">
            <p>rounder</p>
          </div>
        </button>{" "}
        <button
          className={`${button_radius == "pill" && "ring-2 ring-black/30"} h-20 w-40 p-4 flex items-center justify-center bg-black/5 flex-col gap-1 rounded-md`}
          onClick={() => {
            setCardStyle({ ...cardStyle, button_radius: "pill" });
          }}
        >
          <div className="w-full h-10 flex bg-white items-center rounded-full justify-center font-bold text-sm ring ring-black/40 shadow-(--shadow-card)">
            <p>Pill</p>
          </div>
        </button>
      </div>
      <div className="font-semibold flex flex-col mt-2 gap-2">
        <p className="text-md">Button background color</p>
        <ColorPicker property="button_bg" />
      </div>
      <div className="font-semibold flex flex-col mt-2 gap-2">
        <p className="text-md">Button text color</p>
        <ColorPicker property="button_color" />
      </div>

      <Button className="w-40 mt-3" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <Spinner/> : "Save changes"}
      </Button>
    </div>
  );
};

export default Buttons;
