import ReactDOM from "react-dom";
import { useEffect, type ReactNode, type EffectCallback } from "react";
import ModalContent from "./ModalContent";

interface Props {
    children: ReactNode;
    close: () => void;
}

export default function Modal({ children, close }: Props): JSX.Element {
    const portal = <div onClick={close}>
        <ModalContent children={children} close={close} />
    </div>;

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
