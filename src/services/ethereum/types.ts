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

export interface EthereumProvider {
    readonly ethereum: Provider;
    connect(method: string): Promise<string[]>;
    switchChain(chainId: string): Promise<null>;
    getChainId(): Promise<number>;

}

export type EthereumProviders = {
    [key: string]: EthereumProvider;
};