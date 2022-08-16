import { useState } from "react";
import type { ConnectionService, ProviderIds } from "../../services/ethereum";
import { handleErrorMessage } from "../../utils/error";

interface Props {
    connectionService: ConnectionService
}

export default function ConnectWallet({ connectionService }: Props): JSX.Element {
    const [isMetaMaskInstalled] = useState(connectionService.isProviderAvailable("metamask"));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const connect = async (providerId: ProviderIds): Promise<void> => {
        try {
            await connectionService.connect(providerId);
        } catch (error: any) {
            setErrorMessage(handleErrorMessage(error));
        }
    };

    const connectToMetamask = () => connect("metamask");
    const connectToCoinbaseWallet = () => connect("coinbase_wallet");
    const connectToWalletConnect = () => connect("wallet_connect");

    return (
        <>
            <ul>
                {!isMetaMaskInstalled && <li><a href="https://metamask.io/">Install MetaMask</a></li>}
                {isMetaMaskInstalled && <li onClick={connectToMetamask}>MetaMask</li>}
                <li onClick={connectToCoinbaseWallet}>Coinbase Wallet</li>
                <li onClick={connectToWalletConnect}>WalletConnect</li>
            </ul>
            {errorMessage && <span>{errorMessage}</span>}
        </>
    );
}
