import EventEmitter from "events";
import makeState from "../state";
import type { Provider, EthereumProviders, EthereumProvider } from "../types";

export const PROVIDER_ID_STORAGE_KEY = "providerId";

export interface ConnectionState {
    account: string | null;
    chainId: number | null;
    ethereum: Provider | null;
}

export interface ConnectionService extends EventEmitter {
    connect(providerId: string, method?: string): Promise<void>;
    disconnect(): void;
    isProviderAvailable(providerId: string): boolean;
    getState(): ConnectionState;
    switchChain(chainIdInHex: string): Promise<void>;
}

export type UseConnectionService = (ethereumProviders: EthereumProviders) => ConnectionService;

const initialState: Readonly<ConnectionState> = {
    account: null,
    chainId: null,
    ethereum: null
};

export function makeUseConnectionService(): UseConnectionService {
    let ethereumProviders: EthereumProviders;
    let ethereumProvider: EthereumProvider | null;

    const emitter = new EventEmitter();

    const handleStateChanged = (state: ConnectionState): void => {
        emitter.emit("stateChanged", state);
    };

    const [state, setState] = makeState<ConnectionState>(initialState, handleStateChanged);

    const handleAccountsChanged = ([account]: string[]): void => {
        if (!account) {
            return disconnect();
        }
        setState({ account });
    };

    const handleChainChanged = (chainId: number | string): void => {
        // 1. metamask emits base 16 string
        // 2. coinbase emits base 10 number
        // 3. wallet connect emits base 10 number
        setState({ chainId: typeof chainId === "number" ? chainId : parseInt(chainId, 16) });
    };

    const addListeners = (): void => {
        state.ethereum!.on("accountsChanged", handleAccountsChanged);
        state.ethereum!.on("chainChanged", handleChainChanged);
    };

    const removeListeners = (): void => {
        state.ethereum!.removeListener("accountsChanged", handleAccountsChanged);
        state.ethereum!.removeListener("chainChanged", handleChainChanged);
    };

    const getState = (): ConnectionState => {
        return { ...state };
    };

    const getEthereumProviderById = (providerId: string): EthereumProvider => {
        if (!ethereumProviders[providerId]) {
            throw new Error("Invalid provider identifier.");
        }
        return ethereumProviders[providerId];
    };

    const autoConnect = (): void => {
        const providerId = window.localStorage.getItem(PROVIDER_ID_STORAGE_KEY);
        if (providerId) {
            connect(providerId, "eth_accounts");
        }
    };

    const connect = async (providerId: string, method: string = "eth_requestAccounts"): Promise<void> => {
        ethereumProvider = getEthereumProviderById(providerId);
        const [account] = await ethereumProvider.connect(method);
        if (account) {
            const ethereum = ethereumProvider.ethereum;
            const chainId = await ethereumProvider.getChainId();
            setState({ account, chainId, ethereum });
            addListeners();
            window.localStorage.setItem(PROVIDER_ID_STORAGE_KEY, providerId);
        }
    };

    const disconnect = (): void => {
        removeListeners();
        ethereumProvider = null;
        setState(initialState);
        window.localStorage.removeItem(PROVIDER_ID_STORAGE_KEY);
    };

    const switchChain = async (chainIdInHex: string): Promise<void> => {
        await ethereumProvider!.switchChain(chainIdInHex);
    };

    const isProviderAvailable = (providerId: string): boolean => {
        return ethereumProviders[providerId] !== undefined;
    };

    const connectionService: ConnectionService = Object.assign(emitter, {
        connect,
        disconnect,
        getState,
        isProviderAvailable,
        switchChain
    });

    return function (_ethereumProviders: EthereumProviders): ConnectionService {
        if (!ethereumProviders) {
            ethereumProviders = _ethereumProviders;
            autoConnect();
        }
        return connectionService;
    };
}

export const useConnectionService = makeUseConnectionService();
