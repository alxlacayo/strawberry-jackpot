import React, { useEffect, ReactNode, type EffectCallback } from "react";
import ReactDOM from "react-dom";
import Container from "./Modal.styled";
import ModalContent from "./ModalContent";

interface Props {
    children: ReactNode;
    close: () => void;
}

export default function Modal({ children, close }: Props): JSX.Element {
    const portal = <Container onClick={close}>
            <ModalContent children={children} close={close} />
    </Container>;

    useEffect((): ReturnType<EffectCallback> => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === "Escape" || event.key === "Esc") {
                close();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return (): void => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [close]);

    return ReactDOM.createPortal(portal, document.body);
}
