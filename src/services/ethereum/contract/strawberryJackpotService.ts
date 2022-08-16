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

export interface StrawberryJackpotState {
    costPerSpin: string;
    miniPrize: string;
    megaPrize: string;
}

export interface StrawberryJackpotService extends EventEmitter {
    getChainId(): number;
    getAddress(): string;
    getState(): StrawberryJackpotState;
    isSpinInProgress(account: string): Promise<boolean>;
    spin(): Promise<void>;
}

export type UseStrawberryJackpotService = (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null) => StrawberryJackpotService;

const initialState: Readonly<StrawberryJackpotState> = {
    costPerSpin: "0",
    miniPrize: "0",
    megaPrize: "0"
};

export function makeUseStrawberryJackpotService(
    chainName: string,
    contractAddress: string,
    contractInterface: ContractInterface
): UseStrawberryJackpotService {
    const emitter = new EventEmitter();
    const provider = getProvider(chains[chainName].chainId);
    const contract = new Contract(contractAddress, contractInterface, provider);

    const [state, setState] = makeState(initialState, (state: StrawberryJackpotState): void => {
        emitter.emit("StateChanged", state);
    });

    let signer: ethers.Signer | null = null;
    let blockNumberOnLoad: number;

    const initialize = async (): Promise<void> => {
        blockNumberOnLoad = await provider.getBlockNumber();
        await fetchState();
        addListeners();
    };

    const isSpinInProgress = async (account: string): Promise<boolean> => {
        const spinInProgressFilter = contract.filters.SpinInProgress(account);
        const spinCompleteFilter = contract.filters.SpinComplete(account);

        const spinInProgressEvents = (await contract.queryFilter(spinInProgressFilter)).reverse();
        const spinCompleteEvents = (await contract.queryFilter(spinCompleteFilter)).reverse();

        for (let i = 0; i < spinInProgressEvents.length; i++) {
            const spinInProgressRequestId = spinInProgressEvents[i].args?.requestId as BigNumber;
            const spinCompleteEvent = spinCompleteEvents.find(spinCompleteEvent => {
                const spinCompleteRequestId = spinCompleteEvent.args?.requestId as BigNumber;
                return spinInProgressRequestId.toHexString() === spinCompleteRequestId.toHexString();
            });
            if (!spinCompleteEvent) { return true; }
            // Let's assume after checking the tenth spinInProgress event
            // that this account doesn't have any uncompleted spins.
            if (i > 9) { break; }
        }

        return false;
    };

    const fetchState = async (): Promise<void> => {
        const [costPerSpin, [miniPrize, megaPrize]] = await Promise.all([
            contract.costPerSpin() as BigNumber,
            contract.prizes() as [BigNumber, BigNumber]
        ]);
        setState({
            costPerSpin: bigNumberToEtherString(costPerSpin),
            miniPrize: bigNumberToEtherString(miniPrize),
            megaPrize: bigNumberToEtherString(megaPrize)
        });
    };

    const getState = (): StrawberryJackpotState => ({ ...state });

    const getChainId = (): number => parseInt(chains[chainName].chainId);

    const getAddress = (): string => contractAddress;

    const handleSpinInProgress = (
        from: string,
        requestId: BigNumber,
        cost: BigNumber,
        miniPrize: BigNumber,
        megaPrize: BigNumber,
        amountBurned: BigNumber,
        event: EthersEvent
    ): void => {
        if (event.blockNumber <= blockNumberOnLoad) { return; }
        setState({
            miniPrize: bigNumberToEtherString(miniPrize),
            megaPrize: bigNumberToEtherString(megaPrize)
        });
        emitter.emit(
            "SpinInProgress",
            from,
            requestId.toHexString(),
            bigNumberToEtherString(cost)
        );
    };

    const handleSpinComplete = async (
        from: string,
        requestId: BigNumber,
        numbers: BigNumber,
        winnings: BigNumber,
        event: EthersEvent
    ): Promise<void> => {
        if (event.blockNumber <= blockNumberOnLoad) { return; }
        if (winnings.gt(0)) {
            await fetchState();
        }
        emitter.emit(
            "SpinResults",
            from,
            requestId.toHexString(),
            [...ethers.utils.arrayify(numbers)],
            winnings
        );
    };

    const addListeners = (): void => {
        contract.on("SpinInProgress", handleSpinInProgress);
        contract.on("SpinComplete", handleSpinComplete);
    };

    const spin = async (): Promise<void> => {
        if (!signer) {
            throw Error("A signer is needed to spin.");
        }
        const transactionResponse = await contract.connect(signer).spin() as TransactionResponse;
        await transactionResponse.wait();
    };

    const strawberryJackpotService: StrawberryJackpotService = Object.assign(emitter, {
        getChainId,
        getAddress,
        getState,
        isSpinInProgress,
        spin
    });

    initialize();

    return function (providerOrJsonRpcProvider: Provider | JsonRpcProvider | null): StrawberryJackpotService {
        signer = (providerOrJsonRpcProvider)
            ? getSigner(providerOrJsonRpcProvider)
            : null;
        return strawberryJackpotService;
    };
}

function bigNumberToEtherString(value: BigNumber): string {
    return parseFloat(ethers.utils.formatEther(value))
        .toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
}