// context/ModalContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ModalContextType {
  showModal: (
    onConfirm: () => void,
    options?: { message?: string; title?: string; confirmLabel?: string }
  ) => void;
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
  const [confirmAction, setConfirmAction] = useState<() => void>(
    () => () => {}
  );
  const [message, setMessage] = useState("Are you sure?");
  const [title, setTitle] = useState("Confirmation");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");

  const showModal = (
    onConfirm: () => void,
    options?: { message?: string; title?: string; confirmLabel?: string }
  ) => {
    setConfirmAction(() => onConfirm);
    if (options?.message) setMessage(options.message);
    if (options?.title) setTitle(options.title);
    if (options?.confirmLabel) setConfirmLabel(options.confirmLabel);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={closeModal} // close when clicking backdrop
        >
          <div
            className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
          >
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-2">{message}</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                title="cancel"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
              >
                Cancel
              </button>
              <button
                title="Delete Exam"
                onClick={() => {
                  confirmAction();
                  closeModal();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};
