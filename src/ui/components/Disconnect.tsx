import type { ConnectionService } from "../../services/ethereum";
import TextButton from "../elements/TextButton.styled";

interface Props {
    account: string;
    connectionService: ConnectionService;
}

export default function Disconnect({ account, connectionService }: Props): JSX.Element {
    const disconnect = (): void => {
        connectionService.disconnect();
    };

    const getFormattedAccount = (): string => {
        return account ? `${account.substring(0, 5)}...${account.substring(account.length - 4)}` : "";
    };

    return <TextButton onClick={disconnect}>Disconnect {getFormattedAccount()}</TextButton>
}
