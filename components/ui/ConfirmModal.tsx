import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  destructive?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  destructive = true,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm shadow-(--shadow-card)" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex gap-3 justify-end w-full">
          <button 
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-black font-semibold rounded-full transition-colors flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`px-4 py-2 font-semibold rounded-full transition-colors flex-1 ${
              destructive 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-black hover:bg-neutral-800 text-white"
            }`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};
