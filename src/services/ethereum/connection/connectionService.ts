import EventEmitter from "events";
import makeState from "../state";
import chains from "../chains";
import type { Provider, AddEthereumChainParameter, EthereumProviders, EthereumProvider } from "../types";

export const PROVIDER_ID_STORAGE_KEY = "providerId";

export interface ConnectionState {
    account: string | null;
    chainId: number | null;
    ethereum: Provider | null;
}

export interface ConnectionService extends EventEmitter {
    addChain(chainName: string): Promise<void>;
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
    const emitter = new EventEmitter();
    
    let ethereumProviders: EthereumProviders;
    let ethereumProvider: EthereumProvider | null;

    const [state, setState] = makeState(initialState, (state: ConnectionState): void => {
        emitter.emit("StateChanged", state);
    });

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

    const getState = (): ConnectionState => ({ ...state });

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

    const switchChain = async (chainName: string): Promise<void> => {
        const chainId = chains[chainName].chainId;
        await ethereumProvider!.switchChain(chainId);
    };

    const addChain = async (chainName: string): Promise<void> => {
        const chain = chains[chainName] as AddEthereumChainParameter;
        await ethereumProvider!.addChain(chain);
    };

    const isProviderAvailable = (providerId: string): boolean => {
        return ethereumProviders[providerId] !== undefined;
    };

    const connectionService: ConnectionService = Object.assign(emitter, {
        addChain,
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
