import Image from "next/image";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import LinkPreview from "../links/LinkPreview";
import CollectionPreview from "../collections/collectionPreview";

const CardPreview = () => {
  const { profile, isPreview, setIsPreview, currentCard } =
    useContext(AppContext)!;


  const items = currentCard?.items_list;
  return (
    <div
      className={`bg-white/5 backdrop-blur-xs flex items-center justify-center ${isPreview ? "max-lg:absolute" : "max-lg:hidden"} top-0 left-0 lg:relative max-lg:w-full max-lg:h-full `}
      onClick={() => {
        setIsPreview(false);
      }}
    >
      <div
        className="mt-2 rounded-lg p-1 overflow- py-2 bg-(--page-bg) xl:w-70 w-70 h-140 shadow-(--shadow-card) ring-1 ring-black/10"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className="min-h-130 overflow-y-auto h-full p-1 pb-5  flex flex-col lg:p-2"
        >
          <div className="flex *:shrink-0 flex-col items-center gap-2 h-fit py-4 text-center">
            <Image src={"/user.svg"} alt="user" width={100} height={100} className="h-12 w-12 shrink-0 border rounded-full bg-white/40 ring-1 ring-black/10" />
            <p className="text-lg font-black text-neutral-900">
              {profile?.fullname}
            </p>
            <p className="text-sm font-semibold text-neutral-700">
              @{profile?.username}
            </p>

            <div className="w-full flex gap-2.5 p-2 flex-col flex-1">
              {items?.map((item, i) => {
                return item.type == "link" ? (
                  <LinkPreview key={i} item={item.content} />
                ) : (
                  <CollectionPreview key={i} item={item.content} />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPreview;
