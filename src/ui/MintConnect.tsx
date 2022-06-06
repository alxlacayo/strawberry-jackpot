import Connect from "./components/Connect";
import type { ConnectionService } from "../services/ethereum";

interface Props {
    connectionService: ConnectionService;
}

export default function MintConnect({ connectionService }: Props): JSX.Element {
    return (
        <>
            <span>You must connect before you can mint.</span>
            <br />
            <Connect connectionService={connectionService} />
        </>
    );
}