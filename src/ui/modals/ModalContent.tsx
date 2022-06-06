import { ReactNode, type MouseEvent } from "react";
import Container from "./ModalContent.styled";

interface Props {
    children: ReactNode,
    close: () => void
}

export default function ModalContent({ children, close }: Props): JSX.Element {
    const preventClose = (event: MouseEvent<HTMLDivElement>): void => {
        event.stopPropagation()
    };

    return (
        <Container onClick={preventClose}>
            <img
                className="close"
                src="../../assets/close.svg"
                alt="close"
                onClick={close}
            />
            {children}
        </Container>
    );
}