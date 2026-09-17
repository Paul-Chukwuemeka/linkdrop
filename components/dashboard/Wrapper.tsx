import { useCard } from "@/context/CardContext";
import { useProfile } from "@/context/ProfileContext";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { Modal } from "@/components/ui/Modal";
import React from "react";
import CardPreview from "../cards/CardPreview";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isPreview, isLoadingCard, currentCard, setIsPreview } = useCard();
  const { isLoadingProfile } = useProfile();

  if (isLoadingProfile || (currentCard === null && isLoadingCard)) {
    return <FullScreenLoader className="fixed inset-0 z-50" />;
  }

  return (
    <div className="mx-auto flex-1 w-full h-full min-h-0 grid grid-cols-1 gap-2 sm:gap-3 lg:gap-4 md:grid-cols-[180px_1fr] lg:grid-cols-[200px_1fr] xl:grid-cols-[240px_1fr] max-w-480 [grid-template-rows:minmax(0,1fr)]">
      {children}
      <Modal isOpen={isPreview} onClose={() => setIsPreview(false)} label="Card preview" className="lg:hidden">
        <div className="flex flex-col items-center gap-4">
          <CardPreview mobile={true} />
        </div>
      </Modal>
    </div>
  );
};

export default AppWrapper;
