import { useState } from "react";
import type { ConnectionService, ProviderIds } from "../services/ethereum";
import { getErrorMessage } from "../utils/error";
import Container from "./MintConnectWallet.styled";
import ErrorMessage from "./elements/ErrorMessage.styled";

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
            setErrorMessage(getErrorMessage(error));
        }
    };

    const connectToMetamask = () => connect("metamask");
    const connectToCoinbaseWallet = () => connect("coinbase_wallet");
    const connectToWalletConnect = () => connect("wallet_connect");

    return (
        <Container>
            <ul>
                {!isMetaMaskInstalled && <li><img src="../../assets/metamask.png" alt="metamask" /><a href="https://metamask.io/">Install MetaMask</a></li>}
                {isMetaMaskInstalled && <li onClick={connectToMetamask}><img src="../../assets/metamask.png" alt="metamask" />MetaMask</li>}
                <li onClick={connectToCoinbaseWallet}><img src="../../assets/coinbasewallet.png" alt="coinbase wallet" />Coinbase Wallet</li>
                <li onClick={connectToWalletConnect}><img src="../../assets/walletconnect.png" alt="walletconnect" />WalletConnect</li>
            </ul>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </Container>
    );
}
