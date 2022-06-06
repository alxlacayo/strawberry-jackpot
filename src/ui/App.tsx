import { useEffect, useState } from "react";
import { ethereumProviders, useConnectionService, type ConnectionState } from "../services/ethereum";
import GlobalStyles from "./Global.styled";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Mint from "./Mint";

// maybe make optional ethereumProviders param with default set for testing purposes?
export default function App(): JSX.Element {
    const connectionService = useConnectionService(ethereumProviders);
    const [connectionState, setConnectionState] = useState(connectionService.getState());
    const [count, setCount] = useState(5);

    useEffect((): void => {
        connectionService.on("stateChanged", (state: ConnectionState): void => {
            setConnectionState(state);
        });
    }, [connectionService]);

    return (
        <>
            <GlobalStyles />
            <Header connectionState={connectionState} connectionService={connectionService} />
            <Mint connectionState={connectionState} connectionService={connectionService} />
            {/* <div onClick={() => setCount(prev => prev + 1)}>{count}</div> */}
            <Footer />
        </>
    );
}
