import { useState } from "react";
import { intToHexString } from "../utils/integer";
import contractInfo from "../config/contract";
import type { ConnectionService } from "../services/ethereum";
import { getErrorMessage } from "../utils/error";
import Container from "./MintSwitchChain.styled";
import Button from "./elements/Button.styled"
import ErrorMessage from "./elements/ErrorMessage.styled";

interface Props {
    connectionService: ConnectionService;
}

export default function MintSwitchChain({ connectionService }: Props): JSX.Element {
    const [contractChainId] = useState(intToHexString(contractInfo.chainId));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const switchChain = async () => {
        try {
            await connectionService.switchChain(contractChainId);
        } catch (error: any) {
            setErrorMessage(getErrorMessage(error));
        }
    };

    return (
        <Container>
            <Button onClick={switchChain}>Switch network</Button>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
    );
}
