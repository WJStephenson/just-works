import React, { useState, createContext, Dispatch, SetStateAction, ReactNode } from "react";

interface ModalContextType {
  showAddModal: boolean;
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
  showCompleteModal: boolean;
  setShowCompleteModal: Dispatch<SetStateAction<boolean>>;
}

interface ModalContextProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType>({
  showAddModal: false,
  setShowAddModal: () => {},
  showCompleteModal: false,
  setShowCompleteModal: () => {},
});

export default ModalContext;

export function ModalContextProvider(props: ModalContextProviderProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showAddModal, setShowAddModal, showCompleteModal, setShowCompleteModal }}>
      {props.children}
    </ModalContext.Provider>
  );
}