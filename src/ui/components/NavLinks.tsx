import type { ReactNode } from "react";
import Container from "./NavLinks.styled";

interface Props {
    children?: ReactNode;
}

export default function NavLinks({ children }: Props): JSX.Element {
    return (
        <Container>
            <li>Opensea</li>
            <li>Twitter</li>
            <li>Etherscan</li>
            {children && <li>{children}</li>}
        </Container>
    );
}