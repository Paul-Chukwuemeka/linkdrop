import { Collection } from "@/lib/types";
import LinkPreview from "../links/LinkPreview";

const CollectionPreview = ({ item }: { item: Collection }) => {
  const links = item.links;

  if (links.length == 0) return;

  return (
    <div className="h-fit flex flex-col gap-1">
      <p className="font-semibold capitalize">{item.title}</p>
      <div className="flex flex-col gap-3">
        {links.map((link, i) => {
          return <LinkPreview item={link} key={i} />;
        })}
      </div>
    </div>
  );
};

export default CollectionPreview;
