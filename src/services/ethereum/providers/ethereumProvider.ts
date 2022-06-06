import type { Provider, EthereumProvider } from "../types";

export default function makeEthereumProvider(ethereum: Provider): EthereumProvider {
    const connect = (method: string): Promise<string[]> => {
        return ethereum.request({ method }) as Promise<string[]>;
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

    return {
        get ethereum() { return ethereum; },
        connect,
        switchChain,
        getChainId,
    };
}
