import EventEmitter from "events";
import makeState from "../state";
import chains from "../chains";
import { getProvider, getSigner } from "./provider";
import { ethers, Contract, BigNumber, type ContractInterface, type Event as EthersEvent } from "ethers";
import type { JsonRpcProvider } from "@ethersproject/providers";
import type { TransactionResponse } from "@ethersproject/abstract-provider";
import type { Provider } from "../types";

/*  =====================================================  */
/*  Make sure to be using the same nvm version as hardhat  */
/*  when running these test on local host or rip!          */
/*  =====================================================  */

export interface StrawberryState {
    balance: string;
    hasApproved: boolean;
}

export interface StrawberryService extends EventEmitter {
    approve(spender: string): Promise<void>;
    getChainId(): number;
    getState(): StrawberryState;
    revoke(spender: string): Promise<void>;
}

export type UseStrawberryService = (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null) => StrawberryService;

const initialState: Readonly<StrawberryState> = {
    balance: "0",
    hasApproved: true
};

export function makeUseStrawberryService(
    chainName: string,
    contractAddress: string,
    contractInterface: ContractInterface,
    spenderAddress: string
): UseStrawberryService {
    const emitter = new EventEmitter();
    const provider = getProvider(chains[chainName].chainId);
    const contract = new Contract(contractAddress, contractInterface, provider);

    const [state, setState] = makeState(initialState, (state: StrawberryState): void => {
        emitter.emit("StateChanged", state);
    });

    let signer: ethers.Signer | null = null;
    let signerAddress: string | null = null;
    let blockNumberOnLoad: number;

    const setSigner = async (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null): Promise<void> => {
        if (!providerOrJsonRpcProvider && !signer) { return; }
        if (!providerOrJsonRpcProvider && signer) {
            signer = null;
            signerAddress = null;
            setState(initialState);
            return;
        }
        signer = getSigner(providerOrJsonRpcProvider!);
        const _signerAddress = (await signer.getAddress()).toLowerCase();
        if (_signerAddress !== signerAddress) {
            signerAddress = _signerAddress;
            fetchState();
        }
    };

    const initialize = async (): Promise<void> => {
        blockNumberOnLoad = await provider.getBlockNumber();
        addListeners();
    };

    const fetchState = async (): Promise<void> => {
        const [balance, allowance] = await Promise.all([
            contract.balanceOf(signerAddress) as BigNumber,
            contract.allowance(signerAddress, spenderAddress) as BigNumber
        ]);
        setState({
            balance: ethers.utils.formatEther(balance),
            hasApproved: allowance.gt(0)
        });
    };

    const handleTransfer = (from: string, to: string, amount: BigNumber, event: EthersEvent) => {
        if (event.blockNumber <= blockNumberOnLoad) { return; }
        if (
            signerAddress === from.toLowerCase()
            || signerAddress === to.toLowerCase()
        ) {
            fetchState();
        }
    };

    const handleApproval = (owner: string, spender: string, value: BigNumber, event: EthersEvent) => {
        if (event.blockNumber <= blockNumberOnLoad) { return; }
        console.log({ owner, signerAddress });
        if (signerAddress === owner.toLowerCase()) {
            fetchState();
        } 
    };

    const addListeners = (): void => {
        contract.on("Transfer", handleTransfer);
        contract.on("Approval", handleApproval);
    };

    const approve = async (spender: string): Promise<void> => {
        if (!signer) {
            throw Error("A signer is needed to approve.");
        }
        const amount = ethers.constants.MaxUint256;
        const transactionResponse = await contract.connect(signer).approve(spender, amount) as TransactionResponse;
        await transactionResponse.wait();
    };

    const getState = (): StrawberryState => ({ ...state });

    const getChainId = (): number => parseInt(chains[chainName].chainId);

    const revoke = async (spender: string): Promise<void> => {
        if (!signer) {
            throw Error("A signer is needed to revoke approval.");
        }
        const transactionResponse = await contract.connect(signer).approve(spender, 0) as TransactionResponse;
        await transactionResponse.wait();
    };

    const strawberryService: StrawberryService = Object.assign(emitter, {
        approve,
        getChainId,
        getState,
        revoke
    });

    initialize();

    return function (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null): StrawberryService {
        setSigner(providerOrJsonRpcProvider);
        return strawberryService;
    };
}
