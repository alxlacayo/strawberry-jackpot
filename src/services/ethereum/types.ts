import EventEmitter from "events";

export interface RequestArguments {
    readonly method: string;
    readonly params?: readonly unknown[] | object;
}

export interface SwitchEthereumChainParameter {
    chainId: string;
}

export interface Provider extends EventEmitter {
    request(args: RequestArguments): Promise<unknown>
}

export interface ProviderRpcError extends Error {
    message: string;
    code: number;
    data?: unknown;
}

export interface AddEthereumChainParameter {
    chainId: string;
    chainName: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: 18;
    };
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    iconUrls?: string[];
}

export type EthereumChain = AddEthereumChainParameter;

export interface EthereumProvider {
    addChain(chain: AddEthereumChainParameter): Promise<void>;
    readonly ethereum: Provider;
    connect(method: string): Promise<string[]>;
    switchChain(chainId: string): Promise<null>;
    getChainId(): Promise<number>;
}

export type EthereumProviders = {
    [key: string]: EthereumProvider;
};
