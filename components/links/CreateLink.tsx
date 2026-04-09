import { useState,useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { Spinner } from "../ui/Spinner";


export function CreateLink() {
  const { isLoading, saveLink, setIsCreatingLink } = useContext(AppContext)!;

  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  return (
    <div
      className="absolute px-4 bg-black/30 w-full h-dvh flex items-center justify-center top-0 left-0 backdrop-blur-4xs"
      onClick={() => {
        setIsCreatingLink(false);
      }}
    >
      <form
        className="w-full bg-white rounded-lg flex flex-col p-5 shadow-(--shadow-card) h-fit max-w-150 gap-3 "
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          saveLink({ title, url });
        }}
      >
        <h2 className="text-xl font-semibold">Add Link</h2>
        <input
          type="text"
          placeholder="Title"
          className="border bg-gray-200 h-12 rounded-md px-2 focus:ring-1 ring-gray-400 border-none outline-none"
          value={title}
          required
          onChange={(e) => setTitle(e.currentTarget.value)}
        />
        <input
          type="url"
          placeholder="Url"
          required
          className="border px-2 rounded-md h-12 focus:ring-1 bg-gray-200 ring-gray-400 border-none outline-none"
          value={url}
          onChange={(e) => setUrl(e.currentTarget.value)}
        />
        <button
          disabled={isLoading}
          className="disabled:bg-black/80 rounded-3xl bg-black h-12 text-white font-semibold"
        >
          {isLoading ? <Spinner /> : "Save"}
        </button>
      </form>
    </div>
  );
}

