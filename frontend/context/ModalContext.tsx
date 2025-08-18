// context/ModalContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  showDeleteModal: (onConfirm: () => void, message?: string) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => void>(() => () => {});
  const [message, setMessage] = useState("Are you sure you want to delete this?");

  const showDeleteModal = (onConfirm: () => void, msg?: string) => {
    setConfirmAction(() => onConfirm);
    if (msg) setMessage(msg);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ showDeleteModal, closeModal }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">Delete Confirmation</h2>
            <p className="text-sm text-gray-600 mt-2">{message}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmAction();
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
