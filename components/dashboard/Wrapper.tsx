import { useCard } from "@/context/CardContext";
import React from "react";
import CardPreview from "../cards/CardPreview";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isPreview } = useCard();
  return (
    <div className="mx-auto flex-1 w-full grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] max-w-480">
      {children}
      {isPreview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden flex items-center justify-center p-4 safe-area-inset">
          <CardPreview mobile={true} />
        </div>
      )}
    </div>
  );
};

export default AppWrapper;
