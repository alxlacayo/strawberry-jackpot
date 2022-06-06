import { waitFor, renderHook } from "@testing-library/react";
import { ethers } from "ethers";
import type { JsonRpcProvider } from "@ethersproject/providers";
import { makeUseContractService, type UseContractService, type ContractState } from "./contractService";

/*  =====================================================  */
/*  Make sure to be using the same nvm version as hardhat  */
/*  when running these test on local host or rip!          */
/*  =====================================================  */

let useContractService: UseContractService;
let jsonRpcProvider: JsonRpcProvider;

beforeEach(() => {
    useContractService = makeUseContractService();
    jsonRpcProvider = new ethers.providers.JsonRpcProvider();
});

describe("when initially mounted", () => {
    test("should return maxSupply and totalMinted", async () => {
        const { result } = renderHook(() => useContractService(jsonRpcProvider));
        let state: ContractState;
        result.current.once("stateChanged", (_state: ContractState): void => { state = _state });
        await waitFor(() => {
            expect(state.maxSupply).toBeGreaterThanOrEqual(0);
            expect(state.totalMinted).toBeGreaterThanOrEqual(0);
            expect(state.freeMintsAvailable).toBeGreaterThanOrEqual(0);
        });
    });
});

describe("when mint() is called", () => {
    test("should update state", async () => {
        const { result } = renderHook(() => useContractService(jsonRpcProvider));
        let state: ContractState;
        result.current.once("stateChanged", (_state: ContractState): void => { state = _state });
        await waitFor(() => {
            expect(state.totalMinted).toBeGreaterThanOrEqual(0);
        });
        const quantity = 3;
        await waitFor(async () => {
            const transactionReceipt = await result.current.mint(quantity);
            expect(transactionReceipt.transactionHash).toBeDefined();
        });
        await waitFor(() => {
            expect(result.current.getState().totalMinted).toBe(state.totalMinted + quantity);
        }, { timeout: 15000 });
    }, 20000);
});

// describe("when freeMint() is called", () => {
//     test("should should update state", async () => {
//         const { result } = renderHook(() => useContractService(jsonRpcProvider));
//         let state: ContractState;
//         result.current.once("stateChanged", (_state: ContractState): void => { state = _state });
//         await waitFor(() => {
//             expect(state.totalMinted).toBeGreaterThanOrEqual(0);
//             expect(state.freeMintsAvailable).toBeGreaterThanOrEqual(0);
//         });
//         await waitFor(async () => {
//             const transactionReceipt = await result.current.freeMint();
//             expect(transactionReceipt.transactionHash).toBeDefined();
//         });
//         const freeMintQuantity = 1;
//         await waitFor(() => {
//             expect(result.current.getState().totalMinted).toBe(state.totalMinted + freeMintQuantity);
//             expect(result.current.getState().freeMintsAvailable).toBe(state.freeMintsAvailable - freeMintQuantity);
//         }, { timeout: 15000 });
//     }, 20000);
// });
