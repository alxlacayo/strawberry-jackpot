import React, { useEffect, useState, type EffectCallback } from "react";
import Connect from "./common/Connect";
import Approve from "./Approve";
import SwitchChain from "./SwitchChain";
import Spin from "./Spin";
import type { StrawberryJackpotService, StrawberryService, StrawberryState, ConnectionService } from "../services/ethereum"

interface Props {
    strawberryJackpotService: StrawberryJackpotService;
    strawberryService: StrawberryService;
    strawberryState: StrawberryState;
    connectionService: ConnectionService;
    isSpinInProgress: boolean;
    setIsSpinInProgress: React.Dispatch<React.SetStateAction<boolean>>;
    setModalMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function Buttons({
    strawberryJackpotService,
    strawberryService,
    strawberryState,
    connectionService,
    isSpinInProgress,
    setIsSpinInProgress,
    setModalMessage
}: Props): JSX.Element {
    const { account, chainId } = connectionService.getState();
    const [spender] = useState(strawberryJackpotService.getAddress());
    const [hasApproved, setHasApproved] = useState(strawberryState.hasApproved);

    useEffect((): ReturnType<EffectCallback> => {
        setHasApproved(strawberryState.hasApproved);
    }, [strawberryState, setHasApproved]);

    if (!account) {
        return <Connect connectionService={connectionService} />;
    }

    if (chainId !== strawberryJackpotService.getChainId()) {
        return <SwitchChain connectionService={connectionService} />;
    }

    if (!hasApproved) {
        return <Approve
            strawberryService={strawberryService}
            setHasApproved={setHasApproved}
            setModalMessage={setModalMessage}
            spender={spender}
        />;
    }

    return <Spin
        strawberryJackpotService={strawberryJackpotService}
        isSpinInProgress={isSpinInProgress}
        setModalMessage={setModalMessage}
        setIsSpinInProgress={setIsSpinInProgress}
    />;
}
