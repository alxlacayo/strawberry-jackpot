import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import makeEthereumProvider from "./ethereumProvider";
import type { EthereumProviders } from "../types";

const APP_NAME = process.env.REACT_APP_PROJECT_NAME || "";
const APP_LOGO_URL = process.env.REACT_APP_PROJECT_LOGO || "";
const DEFAULT_ETH_JSONRPC_URL = `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`;
const DEFAULT_CHAIN_ID = 1;

export const PROVIDER_ID: "coinbase_wallet" = "coinbase_wallet";

export function setCoinbaseWallet(ethereumProviders: EthereumProviders) {
    const coinbaseWallet = new CoinbaseWalletSDK({
        appName: APP_NAME,
        appLogoUrl: APP_LOGO_URL,
        darkMode: false
    });
    const ethereum = coinbaseWallet.makeWeb3Provider(DEFAULT_ETH_JSONRPC_URL, DEFAULT_CHAIN_ID);
    ethereumProviders[PROVIDER_ID] = makeEthereumProvider(ethereum);
}
