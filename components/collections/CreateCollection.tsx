import { useState,useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Spinner } from "../ui/Spinner";


export function CreateCollection() {
  const {
    isLoading,
    setIsCreatingCollection,
    addCollection
  } = useContext(AppContext)!;



  const [title, setTitle] = useState<string>("");
  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => {
        setIsCreatingCollection(false);
      }}
    >
      <form
        className="w-full max-w-md bg-white rounded-xl flex flex-col p-4 sm:p-6 shadow-(--shadow-card) gap-3 sm:gap-4"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          addCollection(title);
        }}
      >
        <h2 className="text-lg sm:text-xl font-semibold">Create Collection</h2>
        <input
          type="text"
          placeholder="Title"
          className="border px-3 sm:px-4 rounded-lg h-11 sm:h-12 focus:ring-2 bg-gray-100 ring-gray-300 border-none outline-none transition-all"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button
          disabled={isLoading}
          className="disabled:bg-black/80 rounded-full bg-black h-11 sm:h-12 text-white font-semibold transition-colors hover:bg-neutral-800 touch-manipulation"
        >
          {isLoading ? <Spinner /> : "Save"}
        </button>
      </form>
    </div>
  );
}