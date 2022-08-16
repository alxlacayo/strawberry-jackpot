import { ReactNode, type MouseEvent } from "react";

interface Props {
    children: ReactNode,
    close: () => void
}

export default function ModalContent({ children, close }: Props): JSX.Element {
    const preventClose = (event: MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation()
    };

    return (
        <div onClick={preventClose}>
            <img
                className="close"
                src="../../assets/close.svg"
                alt="close"
                onClick={close}
            />
            {children}
        </div>
    );
}