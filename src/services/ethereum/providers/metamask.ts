import detectEthereumProvider from '@metamask/detect-provider';
import makeEthereumProvider from './ethereumProvider';
import type { Provider, EthereumProviders } from "../types";

export const PROVIDER_ID: "metamask" = "metamask";

type MetaMask = Provider & {
    providers?: MetaMask[];
    isMetaMask?: boolean;
}

export async function setMetaMask(ethereumProviders: EthereumProviders) {
    let ethereum = await detectEthereumProvider({ mustBeMetaMask: true, silent: true }) as MetaMask;
    if (ethereum) {
        if (ethereum.providers?.length) {
            ethereum = ethereum.providers.find((provider) => provider.isMetaMask)!;
        }
        ethereumProviders[PROVIDER_ID] = makeEthereumProvider(ethereum);
    }
}
