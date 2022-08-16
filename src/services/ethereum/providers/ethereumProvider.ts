import type { Provider, EthereumProvider, AddEthereumChainParameter } from "../types";

export default function makeEthereumProvider(ethereum: Provider): EthereumProvider {
    const connect = (method: string): Promise<string[]> => {
        return ethereum.request({ method }) as Promise<string[]>;
    };
    const addChain = (chain: AddEthereumChainParameter): Promise<void> => {
        return ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [chain]
        }) as Promise<void>;
    };
    const switchChain = (chainId: string): Promise<null> => {
        return ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId }]
        }) as Promise<null>;
    };
    const getChainId = async (): Promise<number> => {
        const chainId = await ethereum.request({ method: "eth_chainId" }) as string;
        return parseInt(chainId, 16);
    };

    // TODO: change this get property?
    return {
        get ethereum() { return ethereum; },
        addChain,
        connect,
        switchChain,
        getChainId,
    };
}
