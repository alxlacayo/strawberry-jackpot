// import Connect from "./Connect";
import Disconnect from "./Disconnect";
import type { ConnectionState, ConnectionService } from "../../services/ethereum";
import Container from "./Header.styled";
// import NavLinks from "./NavLinks";

interface Props {
    connectionState: ConnectionState;
    connectionService: ConnectionService;
}

export default function Header({ connectionState, connectionService }: Props): JSX.Element {
    const component = connectionState.account
        ? <Disconnect account={connectionState.account} connectionService={connectionService} />
        : null;

    return (
        <Container>
            {component}
        </Container>
    );
}
