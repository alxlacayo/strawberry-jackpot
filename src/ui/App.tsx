import { useEffect, useState } from "react";
import { ethereumProviders, useConnectionService, type ConnectionState } from "../services/ethereum";
import GlobalStyles from "./Global.styled";
import Header from "./common/Header";
import Machine from "./Machine";

// maybe make optional ethereumProviders param with default set for testing purposes?
export default function App(): JSX.Element {
    const connectionService = useConnectionService(ethereumProviders);
    const [connectionState, setConnectionState] = useState(connectionService.getState());

    useEffect((): void => {
        connectionService.on("StateChanged", (state: ConnectionState): void => {
            setConnectionState(state);
        });
    }, [connectionService]);

    return (
        <>
            <GlobalStyles />
            <Header connectionState={connectionState} connectionService={connectionService} />
            <Machine connectionState={connectionState} connectionService={connectionService} />
        </>
    );
}
