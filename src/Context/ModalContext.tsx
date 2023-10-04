import { useState, createContext, Dispatch, SetStateAction } from "react";

interface ModalContextType {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
}

const ModalContext = createContext<ModalContextType>({
  show: false,
  setShow: () => {},
});

export default ModalContext;

export function ModalContextProvider(props) {
  const [show, setShow] = useState(false);


  return (
    <ModalContext.Provider value={{ show, setShow }}>
      {props.children}
    </ModalContext.Provider>
  );
}