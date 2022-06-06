import EventEmitter from "events";
import { ethers, Contract, type BigNumber } from "ethers";
import { JsonRpcProvider, type Web3Provider } from "@ethersproject/providers";
import contractInfo from "../../../config/contract";
import makeState from "../state";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";
import type { Provider } from "../types";

/*  =====================================================  */
/*  Make sure to be using the same nvm version as hardhat  */
/*  when running these test on local host or rip!          */
/*  =====================================================  */

export type { TransactionReceipt };

export interface ContractState {
    mintPrice: string;
    maxSupply: number;
    totalMinted: number;
    freeMintsAvailable: number;
}

export interface ContractService extends EventEmitter {
    destroy(): void;
    getChainId(): number;
    getState(): ContractState;
    freeMint(): Promise<TransactionReceipt>;
    mint(quantity: number): Promise<TransactionReceipt>;
}

export type UseContractService = (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null) => ContractService;

const initialState: Readonly<ContractState> = {
    mintPrice: "0",
    maxSupply: 0,
    totalMinted: 0,
    freeMintsAvailable: 0
};

console.log({
    alchemy: process.env.REACT_APP_ALCHEMY_ID,
    etherscan: process.env.REACT_APP_ETHERSCAN_ID,
    infura: process.env.REACT_APP_INFURA_ID,
    pocket: process.env.REACT_APP_POCKET_ID
});

console.log(process.env.NODE_ENV);

export function makeUseContractService(): UseContractService {
    const provider = ethers.getDefaultProvider(contractInfo.networkId, {
        alchemy: process.env.REACT_APP_ALCHEMY_ID,
        etherscan: process.env.REACT_APP_ETHERSCAN_ID,
        infura: process.env.REACT_APP_INFURA_ID,
        pocket: process.env.REACT_APP_POCKET_ID
        // pocket: "169befa4b389b2a654367207556a6f8f4d07e6a7a828f88dc742798c9b01a5cd"
    });

    const contract = new Contract(contractInfo.address, contractInfo.abi, provider);

    let signer: ethers.Signer; 

    const emitter = new EventEmitter();

    const handleStateChanged = (state: ContractState): void => {
        emitter.emit("stateChanged", state);
    };

    const [state, setState] = makeState<ContractState>(initialState, handleStateChanged);

    const mint = async (amount: number): Promise<TransactionReceipt> => {
        const mintPrice = await contract.mintPrice() as BigNumber;
        const value = mintPrice.mul(amount);
        const response = await contract.connect(signer).mint(amount, { value }) as TransactionResponse;
        return await response.wait();
    };

    const freeMint = async (): Promise<TransactionReceipt> => {
        const response = await contract.connect(signer).freeMint() as TransactionResponse;
        return await response.wait();
    };

    const getProvider = (providerOrJsonRpcProvider: Provider | JsonRpcProvider): Web3Provider | JsonRpcProvider => {
        return (providerOrJsonRpcProvider instanceof JsonRpcProvider) 
            ? providerOrJsonRpcProvider
            : new ethers.providers.Web3Provider(providerOrJsonRpcProvider);
    };

    const initialize = async (): Promise<void> => {
        await fetchState();
        addListeners();
    };

    const fetchState = async () => {
        setState({
            mintPrice: ethers.utils.formatEther((await contract.mintPrice() as BigNumber)),
            maxSupply: (await contract.MAX_SUPPLY() as BigNumber).toNumber(),
            totalMinted: (await contract.totalMinted() as BigNumber).toNumber(),
            freeMintsAvailable: (await contract.freeMintsAvailable() as BigNumber).toNumber()
        });
    };

    const getState = (): ContractState => {
        return { ...state };
    };

    const getChainId = (): number => {
        return contractInfo.chainId;
    };

    const addListeners = (): void => {
        const updateState = (totalMinted: BigNumber, freeMintsAvailable?: BigNumber) => {
            if (totalMinted.toNumber() <= state.totalMinted) { return; }
            const _state: Partial<ContractState> = {};
            _state.totalMinted = totalMinted.toNumber();
            if (freeMintsAvailable) {
                _state.freeMintsAvailable = freeMintsAvailable.toNumber();
            }
            setState(_state);
        };
        contract.on("Mint", (totalMinted: BigNumber) => updateState(totalMinted));
        contract.on("FreeMint", (totalMinted: BigNumber, freeMintsAvailable: BigNumber) => updateState(totalMinted, freeMintsAvailable));
    };

    const destroy = (): void => {
        setState(initialState);
    };

    const contractService: ContractService = Object.assign(emitter, {
        destroy,
        getChainId,
        getState,
        freeMint,
        mint
    });

    initialize();

    return function (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null): ContractService {
        if (providerOrJsonRpcProvider) {
            signer = getProvider(providerOrJsonRpcProvider).getSigner();
        }
        return contractService;
    };
}

export const useContractService = makeUseContractService();
