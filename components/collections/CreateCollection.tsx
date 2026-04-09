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
      className="absolute px-4 bg-black/30 w-full h-dvh flex items-center justify-center top-0 left-0 backdrop-blur-4xs"
      onClick={() => {
        setIsCreatingCollection(false);
      }}
    >
      <form
        className="w-full bg-white rounded-lg flex flex-col p-5 shadow-(--shadow-card) h-fit max-w-150 gap-3 "
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          addCollection(title);
        }}
      >
        <h2 className="text-xl font-semibold">Create Collection</h2>
        <input
          type="text"
          placeholder="Title"
          className="border px-2 rounded-md h-12 focus:ring-1 bg-gray-200 ring-gray-400 border-none outline-none"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <button
          disabled={isLoading}
          className=" disabled:bg-black/80 rounded-3xl bg-black h-12 text-white font-semibold"
        >
          {isLoading ? <Spinner /> : "Save"}
        </button>
      </form>
    </div>
  );
}