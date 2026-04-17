import { SetStateAction } from "react";

export const OptionsDropdown = ({
  setIsCreatingCollection,
  setOptions,
}: {
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  setIsCreatingCollection: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="absolute options flex items-center justify-center shadow-(--shadow-nav) z-100 text-black font-semibold bg-white top-full w-full h-14 left-0"
      onClick={(e) => {
        e.stopPropagation();
        setIsCreatingCollection(true);
        setOptions(false);
      }}
    >
      Create a new collection
    </div>
  );
};
