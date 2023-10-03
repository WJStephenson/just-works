//context to store and add/remove properties from the shortlist
import { useState, createContext } from "react";

//create context
export const ModalContext = createContext();

export default function ShortlistContextProvider(props) {
    
    const [show, setShow] = useState(false);

    return (
        <ModalContext.Provider value={{ show, setShow }}>
            {props.children}
        </ModalContext.Provider>
    );
}