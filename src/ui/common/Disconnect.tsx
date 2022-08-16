import type { ConnectionService } from "../../services/ethereum";

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

    return <span onClick={disconnect}>Disconnect {getFormattedAccount()}</span>
}
