import React from "react";
import { SpinButtonStyled } from "./common/Buttons.styled";
import { handleErrorMessage } from "../utils/error";
import type { StrawberryJackpotService } from "../services/ethereum";

interface Props {
    strawberryJackpotService: StrawberryJackpotService;
    isSpinInProgress: boolean;
    setModalMessage: React.Dispatch<React.SetStateAction<string | null>>;
    setIsSpinInProgress: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SpinForm({
    strawberryJackpotService,
    isSpinInProgress,
    setModalMessage,
    setIsSpinInProgress
}: Props): JSX.Element {
    const handleSpin = async (): Promise<void> => {
        setModalMessage("Waiting for transaction.");
        const isSpinSuccessful = await spin();
        setIsSpinInProgress(isSpinSuccessful);
        setModalMessage(isSpinSuccessful
            ? "Waiting for chainlink oracle."
            : "Transaction failed."
        );
    };

    const spin = async (): Promise<boolean> => {
        try {
            await strawberryJackpotService.spin();
            return true;
        } catch (error: any) {
            handleErrorMessage(error);
            return false;
        }
    };

    return (
        <>
            {!isSpinInProgress
                ? <SpinButtonStyled onClick={handleSpin}>Spin</SpinButtonStyled>
                : <SpinButtonStyled>Spin</SpinButtonStyled>
            }
        </>
    );
}
