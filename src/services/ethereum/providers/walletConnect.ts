import WalletConnectProvider from "@walletconnect/web3-provider";
import makeEthereumProvider from "./ethereumProvider";
import type { Provider, EthereumProviders } from "../types";

export const PROVIDER_ID: "wallet_connect" = "wallet_connect";

export function setWalletConnect(ethereumProviders: EthereumProviders) {
    const provider = new WalletConnectProvider({
        infuraId: process.env.REACT_APP_INFURA_ID
    });
    ethereumProviders[PROVIDER_ID] = Object.assign(
        makeEthereumProvider(provider as unknown as Provider),
        { connect: async (method: string): Promise<string[]> => await provider.enable() }
    );
}
