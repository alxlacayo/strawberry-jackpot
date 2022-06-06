import { act, waitFor, renderHook } from "@testing-library/react";
import { makeUseConnectionService, PROVIDER_ID_STORAGE_KEY, type UseConnectionService, type ConnectionState } from "./connectionService";
import { mockProvider } from "../providers/mock";
import type { EthereumProviders } from "../types";

/*  =====================================================  */
/*  Make sure to be using the same nvm version as hardhat  */
/*  when running these test on local host or rip!          */
/*  =====================================================  */

const PROVIDER_ID = "mock_wallet";
const ethereumProviders: EthereumProviders = {};
ethereumProviders[PROVIDER_ID] = mockProvider;

let useConnectionService: UseConnectionService;

beforeEach(() => {
    useConnectionService = makeUseConnectionService();
});

afterEach(() => {
    mockProvider.ethereum.removeAllListeners("accountsChanged");
    mockProvider.ethereum.removeAllListeners("chainChanged");
    window.localStorage.removeItem(PROVIDER_ID_STORAGE_KEY);
});

describe("when initially mounted", () => {
    test("should autoconnect if valid provider is set in storage", async () => {
        window.localStorage.setItem(PROVIDER_ID_STORAGE_KEY, PROVIDER_ID);
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        await waitFor(() => expectConnection(result.current.getState()));
    });
});

describe("when connect() is called", () => {
    test("should throw error if providerName is invalid", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        const promise = result.current.connect("invalid_provider");
        await expect(promise).rejects.toThrow(new Error("Invalid provider identifier."));
    });

    test("should set state if user connects", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        await act(() => result.current.connect(PROVIDER_ID));
        expectConnection(result.current.getState());
        expect(window.localStorage.getItem(PROVIDER_ID_STORAGE_KEY)).toBe(PROVIDER_ID);
    });
});

describe("when disconnect() is called", () => {
    test("should reset state to default", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        await act(() => result.current.connect(PROVIDER_ID));
        expectConnection(result.current.getState());
        expect(window.localStorage.getItem(PROVIDER_ID_STORAGE_KEY)).toBe(PROVIDER_ID);
        act(() => result.current.disconnect());
        expectNoConnection(result.current.getState());
        expect(window.localStorage.getItem(PROVIDER_ID_STORAGE_KEY)).toBeNull();
    });
});

describe("when switchChain() is called", () => {
    test("should update chainId and isOnMainnet", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        await act(() => result.current.connect(PROVIDER_ID));
        await act(() => result.current.switchChain("0x2a"));
        await waitFor(() => {
            expect(result.current.getState().chainId).toBe(42);
        });
        await act(() => result.current.switchChain("0x1"));
        await waitFor(() => {
            expect(result.current.getState().chainId).toBe(1);
        });
    });
});

describe("when accountsChanged event is emitted", () => {
    test("should update account", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        const someEthAddress = "0x3E3BD2d9F2267533A4d340254Ed309347502e801";
        await act(() => result.current.connect(PROVIDER_ID));
        act(() => void result.current.getState().ethereum!.emit("accountsChanged", [someEthAddress]));
        expect(result.current.getState().account).toBe(someEthAddress);
    });

    test("should reset state if accounts array is empty", async () => {
        const { result } = renderHook(() => useConnectionService(ethereumProviders));
        await act(() => result.current.connect(PROVIDER_ID));
        expectConnection(result.current.getState());
        act(() => void result.current.getState().ethereum!.emit("accountsChanged", []));
        expectNoConnection(result.current.getState());
    });
});

function expectConnection(state: ConnectionState) {
    expect(typeof state.account).toBe("string");
    expect(typeof state.chainId).toBe("number");
    expect(typeof state.ethereum).toBe("object");
}

function expectNoConnection(state: ConnectionState) {
    expect(state.account).toBeNull();
    expect(state.chainId).toBeNull();
    expect(state.ethereum).toBeNull();
}
