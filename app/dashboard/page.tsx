"use client";
import { SetStateAction, useContext, useMemo, useState } from "react";
import { AppContext } from "@/context/AppContext";
import Image from "next/image";
import { PenLine, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import CardPreview from "@/components/cards/CardPreview";
import { apiFetch } from "@/lib/api";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { ItemFromList } from "@/lib/types";
import { DraggableLink } from "../../components/links/LinkRow";
import { CreateLink } from "@/components/links/CreateLink";
import { CreateCollection } from "@/components/collections/CreateCollection";
import { CollectionBlock } from "@/components/collections/CollectionBlock";
import { useAuth } from "@/hooks/useAuth";
import { TbLogout } from "react-icons/tb";

export default function DashboardPage() {
  const {
    profile,
    error,
    currentCard,
    loadCard,
    isCreatingLink,
    isCreatingCollection,
    setIsCreatingCollection,
    setIsCreatingLink,
    isPreview,
    setIsPreview
  } = useContext(AppContext)!;
  const { logout } = useAuth();


  const [options, setOptions] = useState(false);
  const [activeId, setActiveId] = useState("");

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragStart(e: DragStartEvent) {
    setActiveId(e.active.id as string);
  }

  const items = useMemo(() => {
    return currentCard?.items_list || null;
  }, [currentCard]);

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!items) return;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.content.id === active.id);
      const newIndex = items.findIndex((i) => i.content.id === over.id);
      if (oldIndex < 0 || newIndex < 0) return;
      const reordered: ItemFromList[] = arrayMove(
        items,
        oldIndex,
        newIndex,
      ).map((item, index) => ({
        ...item,
        position: index + 1,
      }));
      await handleReorder(currentCard!.id, reordered);
      loadCard(currentCard!.id);
    }
  }

  console.log( "current",currentCard);

  const activeItem =
    currentCard &&
    currentCard.items_list.find((item) => item.content.id === activeId);

  return (
    <div className="flex min-w-0 flex-col h-full gap-4">
      <div className="bg-white p-6 flex gap-2 items-center shadow-(--shadow-card) ring-1 ring-(--color-border)">
        <div
          className={`${!profile?.avatar_url && "p-3"} w-11 h-11 rounded-full ring-2 ring-gray-600/50 md:w-13 md:h-13 overflow-hidden flex items-center justify-center bg-gray-300`}
        >
          <Image
            src={profile?.avatar_url ? profile?.avatar_url : "/user.svg"}
            alt={profile?.fullname || "User"}
            className="border-none   outline-none"
            width={80}
            height={80}
          />
        </div>
        <div className="gap-0.5 flex-1 flex flex-col">
          <Link
            href={"/dashboard/appearance#username"}
            className="text-md font-medium capitalize flex gap-1 items-center"
          >
            {profile?.fullname}
            <PenLine className="w-4" />
          </Link>
          <Link
            href={"/dashboard/appearance#fullname"}
            className="text-sm border-b leading-3 border-dashed w-fit "
          >
            @{profile?.username}
          </Link>
        </div>

        <button
          className="w-10 h-10 md:hidden justify-center text-gray-700 flex items-center shadow-[0px_0px_5px] shadow-gray-500/50 bg-white rounded-full "
          onClick={logout}
        >
          <TbLogout className="w-5" />
        </button>
      </div>
      {error && (
        <div className="bg-red-50 p-4 text-sm text-red-700 ring-1 ring-red-100">
          {error}
        </div>
      )}
      <div className="bg-white flex-1 w-full flex overflow-auto justify-center">
        <div className="flex items-center flex-1 overflow-auto max-w-380 bg-white gap-4 relative">
          <div className="overflow-auto flex justify-center flex-1 w-full p-6 h-full">
            <div className="max-w-200 w-full h-fit shrink-0 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl mb-1 flex items-center gap-1 font-semibold">
                  {currentCard?.name} <PenLine className="w-4" />
                </h2>
                {/* Mobile preview toggle */}
                <button
                  className="md:hidden px-4 py-2 bg-black text-white rounded-full text-sm font-medium"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? "Hide Preview" : "Show Preview"}
                </button>
              </div>
              <div className="flex relative rounded-3xl items-center w-full border bg-black text-white h-12">
                <button
                  className="flex-1 h-12 rounded-3xl"
                  onClick={() => {
                    setIsCreatingLink(true);
                  }}
                >
                  Add a new Link
                </button>
                <button
                  className="border-l rounded-l-none rounded-3xl h-full border-gray-400 cursor-pointer  px-3"
                  onClick={() => {
                    setOptions(!options);
                  }}
                >
                  {options ? <ChevronUp /> : <ChevronDown />}
                  {options && (
                    <Options
                      setOptions={setOptions}
                      setIsCreatingCollection={setIsCreatingCollection}
                    />
                  )}
                </button>
              </div>
              {isCreatingLink && <CreateLink />}
              {isCreatingCollection && <CreateCollection />}
              {options}
              {currentCard && (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={currentCard.items_list.map((_, i) => i)}
                    strategy={verticalListSortingStrategy}
                  >
                    {currentCard?.items_list.map((item, i) => {
                      return item.type == "link" ? (
                        <DraggableLink key={i} item={item.content} />
                      ) : (
                        <CollectionBlock key={i} item={item.content} />
                      );
                    })}
                  </SortableContext>
                  <DragOverlay>
                    {activeItem &&
                      (activeItem.type == "link" ? (
                        <DraggableLink item={activeItem.content} />
                      ) : (
                        <CollectionBlock item={activeItem.content} />
                      ))}
                  </DragOverlay>
                </DndContext>
              )}
            </div>
          </div>
          {/* Preview: Overlay on mobile, side-by-side on md+ */}
          
        </div>
      </div>
    </div>
  );
}

async function handleReorder(card_id: string, reordered: ItemFromList[]) {
  const items = reordered.map((item) => ({
    type: item.type,
    id: item.content.id,
    position: item.position,
  }));
  const res = await apiFetch(`/cards/${card_id}/reorder`, {
    method: "PATCH",
    json: {
      items,
    },
  });
  return res;
}

const Options = ({
  setIsCreatingCollection,
  setOptions,
}: {
  setOptions: React.Dispatch<SetStateAction<boolean>>;
  setIsCreatingCollection: React.Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="absolute options flex items-center justify-center  shadow-(--shadow-nav) z-100 text-black font-semibold bg-white top-full w-full h-14 left-0"
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
