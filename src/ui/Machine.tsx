import { useState, useEffect, type EffectCallback, useCallback } from "react";
import config from "../config/config";
import { makeUseStrawberryService, makeUseStrawberryJackpotService } from "../services/ethereum";
import Reels from "./Reels";
import Prizes from "./Prizes";
import Buttons from "./Buttons";
import Modal from "./modals/Modal";
import { MachineStyled, MachineRightSideStyled } from "./Machine.styled";
import type { ConnectionState, ConnectionService, StrawberryState, StrawberryJackpotState } from "../services/ethereum";

interface Props {
    connectionState: ConnectionState;
    connectionService: ConnectionService;
}

const useStrawberryService = makeUseStrawberryService(
    config.chainName,
    config.contracts.strawberry.address,
    config.contracts.strawberry.interface,
    config.contracts.strawberryJackpot.address
);
const useStrawberryJackpotService = makeUseStrawberryJackpotService(
    config.chainName,
    config.contracts.strawberryJackpot.address,
    config.contracts.strawberryJackpot.interface
);

export default function Machine({ connectionState, connectionService }: Props): JSX.Element {
    const { account, ethereum } = connectionState;
    const strawberryJackpotService = useStrawberryJackpotService(ethereum);
    const [strawberryJackpotState, setStrawberryJackpotState] = useState(strawberryJackpotService.getState());
    const strawberryService = useStrawberryService(ethereum);
    const [strawberryState, setStrawberryState] = useState(strawberryService.getState());
    const [isSpinInProgress, setIsSpinInProgress] = useState(false);
    const [stopPositions, setStopPositions] = useState<number[] | null>(null);
    const [modalMessage, setModalMessage] = useState<string | null>(null);
    const [audio] = useState(new Audio("/assets/slot-machine.mp3"));

    const closeModal = (): void => setModalMessage(null);

    const checkForSpinInProgress = useCallback(async (): Promise<void> => {
        if (!account) { return; }
        const isSpinInProgress = await strawberryJackpotService.isSpinInProgress(account);
        if (isSpinInProgress) {
            setIsSpinInProgress(true);
        }
    }, [account, strawberryJackpotService, setIsSpinInProgress]);

    const handleStrawberryJackpotStateChanged = useCallback((state: StrawberryJackpotState): void => {
        setStrawberryJackpotState(state);
    }, [setStrawberryJackpotState]);

    const handleSpinInProgress = useCallback((from: string, requestId: string): void => {
        console.log({ from, requestId });
        if (account?.toLowerCase() === from.toLowerCase()) {
            setIsSpinInProgress(true);
        }
    }, [account, setIsSpinInProgress]);

    const handleSpinResults = useCallback((from: string, requestId: string, stopPositions: number[], winnings: number): void => {
        if (account?.toLowerCase() === from.toLowerCase()) {
            setModalMessage(null);
            setTimeout(() => {
                audio.play();
                setStopPositions(stopPositions);
            }, 3000);
            console.log("Spinning starts in 3 seconds.");
        }
    }, [account, audio, setModalMessage, setStopPositions]);

    const handleSpinComplete = useCallback((): void => {
        setIsSpinInProgress(false);
        setStopPositions(null);
    }, [setIsSpinInProgress, setStopPositions]);

    const handleStrawberryStateChanged = useCallback((state: StrawberryState): void => {
        setStrawberryState(state);
    }, [setStrawberryState]);

    // TODO: delete this.
    useEffect(() => {
        const timer = setTimeout(() => {
            audio.play();
            setStopPositions([6, 6, 6, 6]);
        }, 3000);
        console.log("Spinning starts in 3 seconds.");
        return () => {
            clearTimeout(timer);
        }
    }, []);

    useEffect((): ReturnType<EffectCallback> => {
        checkForSpinInProgress();
        strawberryJackpotService.on("StateChanged", handleStrawberryJackpotStateChanged);
        strawberryJackpotService.on("SpinInProgress", handleSpinInProgress);
        strawberryJackpotService.on("SpinResults", handleSpinResults);
        strawberryService.on("StateChanged", handleStrawberryStateChanged);
        return (): void => {
            strawberryJackpotService.removeListener("StateChanged", handleStrawberryJackpotStateChanged);
            strawberryJackpotService.removeListener("SpinInProgress", handleSpinInProgress);
            strawberryJackpotService.removeListener("SpinResults", handleSpinResults);
            strawberryService.removeListener("StateChanged", handleStrawberryStateChanged);
        };
    }, [
        strawberryService,
        strawberryJackpotService,
        checkForSpinInProgress,
        handleSpinInProgress,
        handleSpinResults,
        handleStrawberryJackpotStateChanged,
        handleStrawberryStateChanged
    ]);

    useEffect((): ReturnType<EffectCallback> => {
        if (isSpinInProgress) {
            setModalMessage("Waiting for chainlink oracle.")
        }
    }, [isSpinInProgress, setModalMessage]);

    const handleRevoke = async () => {
        strawberryService.revoke(strawberryJackpotService.getAddress());
    };

    return (
        <MachineStyled>
            <div>
                <Prizes
                    megaPrize={strawberryJackpotState.megaPrize}
                    miniPrize={strawberryJackpotState.miniPrize}
                />
                <Reels
                    stopPositions={stopPositions}
                    handleSpinComplete={handleSpinComplete}
                />
            </div>
            <MachineRightSideStyled>
                <img src="/assets/strawberry-slots.png" width="280" />
                <Buttons
                    strawberryJackpotService={strawberryJackpotService}
                    strawberryService={strawberryService}
                    strawberryState={strawberryState}
                    connectionService={connectionService}
                    isSpinInProgress={isSpinInProgress}
                    setIsSpinInProgress={setIsSpinInProgress}
                    setModalMessage={setModalMessage}
                />
            </MachineRightSideStyled>
            {/* <span onClick={handleRevoke}>Revoke</span> */}
            {modalMessage &&
                <Modal close={closeModal}>
                    <span>{modalMessage}</span>
                </Modal>
            }
        </ MachineStyled>
    );
}
