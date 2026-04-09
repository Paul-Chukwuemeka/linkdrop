import { useMemo, useState } from "react";
import ColorPicker from "../ui/colorPicker";
import { isLight, lighten, darken } from "@/utils/colors";
import { CiImageOn } from "react-icons/ci";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

const Background = () => {
  const [backgroundStyle, setBackgroundStyle] = useState("solid");
  const { cardStyle, updateStyle, isSaving } = useContext(AppContext)!;

  const backgroundColor = cardStyle?.card_bg ?? "ffffff";

  const endColor = useMemo(
    () =>
      isLight(backgroundColor)
        ? darken(backgroundColor, 0.4)
        : lighten(backgroundColor, 0.4),
    [backgroundColor],
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-180">
      <div className="font-semibold flex flex-col mt-1 gap-2">
        <h2 className="text-md font-semibold">Background Color</h2>
        <ColorPicker property="card_bg" />
      </div>
      <div>
        <h2 className="text-md font-semibold">Background Style</h2>
        <div className="flex *:shrink-0 flex-wrap">
          <div className="flex  flex-col font-semibold text-black/60 gap-1 w-fit text-lg text-center p-2">
            <button
              className={` ${backgroundStyle == "solid" ? "ring-2 ring-black/50" : "ring ring-black/20"} shrink-0 rounded-lg w-30 h-30`}
              style={{ backgroundColor: `#${backgroundColor}` }}
              onClick={() => setBackgroundStyle("solid")}
            ></button>
            <p>Solid</p>
          </div>
          <div className="flex  flex-col font-semibold text-black/60 gap-1 w-fit text-lg text-center p-2">
            <button
              className={` ${backgroundStyle == "gradient" ? "ring-2 ring-black/50" : "ring ring-black/20"} shrink-0 rounded-lg w-30 h-30`}
              style={{
                background: `linear-gradient(#${backgroundColor}, #${endColor})`,
              }}
              onClick={() => setBackgroundStyle("gradient")}
            ></button>
            <p>Gradient</p>
          </div>
          <div className="flex  flex-col font-semibold text-black/60 gap-1 w-fit text-lg text-center p-2">
            <button
              className={` flex items-center justify-center text-4xl bg-black/5 ${backgroundStyle == "image" ? "ring-2 ring-black/50" : "ring ring-black/20"} shrink-0 rounded-lg w-30 h-30`}
              onClick={() => setBackgroundStyle("image")}
            >
              <CiImageOn />
            </button>
            <p>Image</p>
          </div>
        </div>
      </div>
      <Button className="w-40 mt-3" onClick={updateStyle} disabled={isSaving}>
        {isSaving ? <Spinner/> : "Save changes"}
      </Button>
    </div>
  );
};

export default Background;
