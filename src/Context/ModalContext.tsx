import React, { useState, createContext, Dispatch, SetStateAction, ReactNode } from "react";

interface ModalContextType {
  showAddModal: boolean;
  setShowAddModal: Dispatch<SetStateAction<boolean>>;
  showCompleteModal: boolean;
  setShowCompleteModal: Dispatch<SetStateAction<boolean>>;
  showDeleteModal: boolean;
  setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
  showEditJobModal: boolean;
  setShowEditJobModal: Dispatch<SetStateAction<boolean>>;
}

interface ModalContextProviderProps {
  children: ReactNode;
}

const ModalContext = createContext<ModalContextType>({
  showAddModal: false,
  setShowAddModal: () => {},
  showCompleteModal: false,
  setShowCompleteModal: () => {},
  showDeleteModal: false,
  setShowDeleteModal: () => {},
  showEditJobModal: false,
  setShowEditJobModal: () => {},
});

export default ModalContext;

export function ModalContextProvider(props: ModalContextProviderProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditJobModal, setShowEditJobModal] = useState(false);

  return (
    <ModalContext.Provider value={{ showAddModal, setShowAddModal, showCompleteModal, setShowCompleteModal, showDeleteModal, setShowDeleteModal, showEditJobModal, setShowEditJobModal }}>
      {props.children}
    </ModalContext.Provider>
  );
}