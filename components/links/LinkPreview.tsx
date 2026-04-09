/* eslint-disable @next/next/no-img-element */
import { Link as LinkType } from "@/lib/types";
import Link from "next/link";
import { getDomain } from "@/utils/validate";

const LinkPreview = ({ item }: { item: LinkType }) => {
  const domain = getDomain(item.url);

  return (
    <Link
      href={item.url}
      className="w-full rounded-full shadow-(--shadow-card) bg-white px-3 gap-5 h-12 font-semibold flex items-center"
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
      <p className="capitalize">{item.title}</p>
    </Link>
  );
};

export default LinkPreview;
