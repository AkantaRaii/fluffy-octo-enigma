"use client";
import { useState } from "react";

interface PromptConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  confirmPrompt?: string; // e.g. "DELETE"
  typeThis?: string; // e.g. "Type This: DELETE"
}

export default function PromptConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "This action cannot be undone. Please type the confirmation word below to proceed.",
  confirmLabel = "Confirm",
  confirmPrompt = "DELETE",
  typeThis,
}: PromptConfirmModalProps) {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (input === confirmPrompt) {
      onConfirm();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{message}</p>

        <p className="text-sm text-red-600 mt-4">
          Type <span className="font-bold">{typeThis}</span> to confirm.
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type "${typeThis}" here`}
          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={input !== confirmPrompt}
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-white ${
              input === confirmPrompt
                ? "bg-red-600 hover:bg-red-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
