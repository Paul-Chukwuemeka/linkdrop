/* eslint-disable @next/next/no-img-element */
import { Link as LinkType, CardTheme } from "@/lib/types";
import Link from "next/link";
import { getDomain } from "@/utils/validate";
import { buttonRadiusClasses,shadowStyles } from "@/lib/style-mappings";

function getButtonBgStyle(cardStyle: CardTheme | undefined) {
  if (!cardStyle) return undefined;
  if (cardStyle.button_type === "glass") {
    return { background: "rgba(255,255,255,0.3)", backdropFilter: "blur(5px)" };
  }
  if (cardStyle.button_type === "outline") {
    return {
      borderColor: cardStyle.button_color
        ? `#${cardStyle.button_color}`
        : undefined,
      borderWidth: "1px",
    };
  }
  if (cardStyle.button_bg) {
    return { backgroundColor: `#${cardStyle.button_bg}` };
  }
  return undefined;
}

const LinkPreview = ({
  item,
  cardStyle,
}: {
  item: LinkType;
  cardStyle?: CardTheme;
}) => {
  const domain = getDomain(item.url);
  const buttonBgStyle = getButtonBgStyle(cardStyle);

  return (
    <Link
      href={item.url}
      target="_blank"
      className={`w-full px-3 gap-5 h-12 font-semibold flex items-center ${buttonRadiusClasses[cardStyle?.button_radius ?? "round"]}`}
      style={{
        ...buttonBgStyle,
        ...(cardStyle?.shadow && shadowStyles[cardStyle.shadow]),
      }}
    >
      <img
        width={64}
        height={64}
        className="w-5 rounded-md"
        alt="favicon"
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${64}`}
        onError={(e) => {
          e.currentTarget.src = "/globe.svg";
        }}
      />{" "}
      <p
       className="w-full truncate text-start capitalize"
        style={{
          color: cardStyle?.button_color
            ? `#${cardStyle.button_color}`
            : undefined,
        }}
      >
        {item.title}
      </p>
    </Link>
  );
};

export default LinkPreview;