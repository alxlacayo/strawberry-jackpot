import config from "../config/config";
import { SwitchChainButtonStyled } from "./common/Buttons.styled";
import { handleErrorMessage } from "../utils/error";
import type { ConnectionService } from "../services/ethereum";

interface Props {
    connectionService: ConnectionService;
}

export default function SwitchChain({ connectionService }: Props): JSX.Element {
    const switchChain = async (): Promise<void> => {
        try {
            await connectionService.addChain(config.chainName);
        } catch (error: any) {
            handleErrorMessage(error);
        }
    };

    return <SwitchChainButtonStyled onClick={switchChain}>Switch network</SwitchChainButtonStyled>;
}
